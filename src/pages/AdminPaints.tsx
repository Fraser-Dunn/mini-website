import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import AdminNav from "../components/AdminNav";
import { createPaint, deletePaint, updatePaint, type CreatePaintPayload } from "../services/paintsApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagInput } from "@/components/ui/tag-input";
import { computeSuggestedSlot } from "@/lib/paint-layout";
import { normalizeColourName } from "@/lib/tag-colours";
import {
  PEG_BOARD_LOCATION,
  PEG_BOARD_ROWS,
  slotsInRow,
  type Paint,
} from "../types/paint";

interface AdminPaintsProps {
  paints: Paint[];
  onSaved: () => Promise<void>;
}

interface AdminPaintFormState {
  brand: string;
  name: string;
  parentColours: string[];
  type: string;
  count: number;
  location: string;
  hex: string;
  pegRow: number | null;
  pegSlot: number | null;
}

const initialState: AdminPaintFormState = {
  brand: "",
  name: "",
  parentColours: [],
  type: "",
  count: 1,
  location: "",
  hex: "",
  pegRow: null,
  pegSlot: null,
};

const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;

const pegRows = Array.from({ length: PEG_BOARD_ROWS }, (_, i) => i + 1);

const AdminPaints = ({ paints, onSaved }: AdminPaintsProps) => {
  const { paintId } = useParams<{ paintId?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editingPaint = paintId ? paints.find((p) => p.id === paintId) : undefined;
  const isEditing = Boolean(paintId);
  const duplicateSource = !isEditing
    ? paints.find((p) => p.id === searchParams.get("from"))
    : undefined;

  const [formData, setFormData] = useState<AdminPaintFormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (editingPaint) {
      setFormData({
        brand: editingPaint.brand,
        name: editingPaint.name,
        parentColours: editingPaint.parentColours,
        type: editingPaint.type,
        count: editingPaint.count,
        location: editingPaint.location,
        hex: editingPaint.hex ?? "",
        pegRow: editingPaint.pegRow ?? null,
        pegSlot: editingPaint.pegSlot ?? null,
      });
    } else if (duplicateSource) {
      // Same paint, new physical pot - copy everything except where it
      // lives, since that's the whole point of duplicating an entry.
      setFormData({
        brand: duplicateSource.brand,
        name: duplicateSource.name,
        parentColours: duplicateSource.parentColours,
        type: duplicateSource.type,
        count: 1,
        location: "",
        hex: duplicateSource.hex ?? "",
        pegRow: null,
        pegSlot: null,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingPaint?.id, duplicateSource?.id]);

  const { brand, name, parentColours, type, count, location, hex, pegRow, pegSlot } =
    formData;

  const isPegBoard = location === PEG_BOARD_LOCATION;
  const pegSlots = Array.from({ length: slotsInRow(pegRow ?? 1) }, (_, i) => i + 1);

  const suggestedSlot = useMemo(() => {
    if (!isPegBoard || !name.trim() || !type.trim()) return null;
    return computeSuggestedSlot(
      paints,
      { name: name.trim(), type: type.trim() },
      editingPaint?.id
    );
  }, [paints, isPegBoard, name, type, editingPaint?.id]);

  const suggestionApplied =
    suggestedSlot !== null && pegRow === suggestedSlot.row && pegSlot === suggestedSlot.slot;

  const applySuggestedSlot = () => {
    if (!suggestedSlot) return;
    setFormData((prevState) => ({
      ...prevState,
      pegRow: suggestedSlot.row,
      pegSlot: suggestedSlot.slot,
    }));
  };

  // Detect other records that already track this same paint (by name), so we
  // can steer towards bumping an existing stash or flag a peg-board clash
  // instead of silently creating a confusing near-duplicate.
  const nameMatches = useMemo(() => {
    const trimmed = name.trim().toLowerCase();
    if (!trimmed) return [];
    return paints.filter((p) => {
      if (p.id === editingPaint?.id) return false;
      if (p.id === duplicateSource?.id) return false;
      return p.name.trim().toLowerCase() === trimmed;
    });
  }, [paints, name, editingPaint?.id, duplicateSource?.id]);

  const trimmedLocation = location.trim().toLowerCase();
  const pegBoardMatch = isPegBoard
    ? nameMatches.find((p) => p.location === PEG_BOARD_LOCATION)
    : undefined;
  const stashMatch =
    !isPegBoard && trimmedLocation
      ? nameMatches.find((p) => p.location.trim().toLowerCase() === trimmedLocation)
      : undefined;

  const [bumping, setBumping] = useState(false);

  const bumpStashCount = async (match: Paint) => {
    const { id, timestamp, userRef, ...rest } = match;
    void timestamp;
    void userRef;
    const payload: CreatePaintPayload = { ...rest, count: rest.count + 1 };

    setBumping(true);
    try {
      await updatePaint(id, payload);
      await onSaved();
      toast.success(`Added to existing "${match.location}" stash (now ${payload.count})`);
      setFormData(initialState);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to update stash: ${message}`);
    } finally {
      setBumping(false);
    }
  };

  const brandSuggestions = useMemo(
    () => [...new Set(paints.map((p) => p.brand))].sort(),
    [paints]
  );
  const typeSuggestions = useMemo(
    () => [...new Set(paints.map((p) => p.type))].sort(),
    [paints]
  );
  const colourSuggestions = useMemo(
    () => [...new Set(paints.flatMap((p) => p.parentColours).map(normalizeColourName))].sort(),
    [paints]
  );
  const locationSuggestions = useMemo(
    () => [...new Set([PEG_BOARD_LOCATION, ...paints.map((p) => p.location)])].sort(),
    [paints]
  );

  const onMutate = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    setFormData(
      (prevState) => ({ ...prevState, [target.id]: target.value }) as AdminPaintFormState
    );
  };

  const onLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prevState) => ({
      ...prevState,
      location: value,
      ...(value === PEG_BOARD_LOCATION ? {} : { pegRow: null, pegSlot: null }),
    }));
  };

  const onPegRowChange = (value: string) => {
    const row = Number(value);
    setFormData((prevState) => ({
      ...prevState,
      pegRow: row,
      pegSlot: prevState.pegSlot && prevState.pegSlot <= slotsInRow(row) ? prevState.pegSlot : null,
    }));
  };

  const onPegSlotChange = (value: string) => {
    setFormData((prevState) => ({ ...prevState, pegSlot: Number(value) }));
  };

  const onHexChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({ ...prevState, hex: e.target.value }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (parentColours.length < 1) {
      toast.error("Add at least one parent colour");
      return;
    }

    if (isPegBoard && (!pegRow || !pegSlot)) {
      toast.error("Pick a row and slot for the peg board");
      return;
    }

    if (pegBoardMatch) {
      toast.error(`${pegBoardMatch.name} is already on the peg board — pick a different location`);
      return;
    }

    const trimmedHex = hex.trim();
    if (trimmedHex && !HEX_PATTERN.test(trimmedHex)) {
      toast.error("Colour must be a hex code like #8f1f1f");
      return;
    }

    const payload = {
      brand,
      name,
      parentColours,
      type,
      count: Number(count),
      location,
      ...(trimmedHex ? { hex: trimmedHex } : {}),
      ...(isPegBoard ? { pegRow: pegRow!, pegSlot: pegSlot! } : {}),
    };

    setSubmitting(true);

    try {
      if (isEditing && paintId) {
        await updatePaint(paintId, payload);
        await onSaved();
        toast.success("Paint updated");
        navigate("/paints");
      } else {
        await createPaint(payload);
        await onSaved();
        toast.success("Paint saved");
        setFormData(initialState);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to save paint: ${message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async () => {
    if (!paintId || !editingPaint) {
      return;
    }
    if (!window.confirm(`Delete "${editingPaint.name}"? This can't be undone.`)) {
      return;
    }

    setDeleting(true);
    try {
      await deletePaint(paintId);
      await onSaved();
      toast.success("Paint deleted");
      navigate("/paints");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to delete paint: ${message}`);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container max-w-3xl py-14">
      <AdminNav />
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
        {isEditing ? "Editing" : duplicateSource ? "New entry · duplicate" : "New entry"}
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide">
        {isEditing ? "Edit Paint" : "Catalogue a Paint"}
      </h1>
      {duplicateSource && (
        <p className="mt-2 text-sm text-muted-foreground">
          Copied from &ldquo;{duplicateSource.name}&rdquo; — give this pot its own location.
        </p>
      )}
      <div className="mt-8 rounded-sm border border-primary/15 bg-card p-6">
        <form className="grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter paint name here..."
              value={name}
              onChange={onMutate}
              maxLength={60}
              minLength={1}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              list="brand-suggestions"
              placeholder="Enter brand here..."
              value={brand}
              onChange={onMutate}
              maxLength={40}
              minLength={1}
              required
            />
            <datalist id="brand-suggestions">
              {brandSuggestions.map((suggestion) => (
                <option key={suggestion} value={suggestion} />
              ))}
            </datalist>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="type">Type</Label>
            <Input
              id="type"
              list="type-suggestions"
              placeholder="e.g. Base, Layer, Contrast..."
              value={type}
              onChange={onMutate}
              maxLength={20}
              minLength={1}
              required
            />
            <datalist id="type-suggestions">
              {typeSuggestions.map((suggestion) => (
                <option key={suggestion} value={suggestion} />
              ))}
            </datalist>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="count">Count</Label>
            <Input
              id="count"
              type="number"
              placeholder="Pots owned"
              value={count}
              onChange={onMutate}
              min="0"
              max="99"
              required
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label>Parent Colours</Label>
            <TagInput
              value={parentColours}
              onChange={(next) => setFormData((prev) => ({ ...prev, parentColours: next }))}
              suggestions={colourSuggestions}
              placeholder="Type a colour, press Enter..."
              max={5}
              normalize={normalizeColourName}
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="hexText">True Colour (optional)</Label>
            <div className="flex items-center gap-2">
              <input
                id="hexPicker"
                type="color"
                value={HEX_PATTERN.test(hex) ? hex : "#808080"}
                onChange={onHexChange}
                aria-label="Pick true colour"
                className="h-9 w-12 flex-none cursor-pointer rounded-sm border border-input bg-transparent p-1"
              />
              <Input
                id="hexText"
                value={hex}
                onChange={onHexChange}
                placeholder="#8f1f1f"
                maxLength={7}
                className="font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              list="location-suggestions"
              placeholder={`Enter location here, or "${PEG_BOARD_LOCATION}"...`}
              value={location}
              onChange={onLocationChange}
              maxLength={60}
              minLength={1}
              required
            />
            <datalist id="location-suggestions">
              {locationSuggestions.map((suggestion) => (
                <option key={suggestion} value={suggestion} />
              ))}
            </datalist>
          </div>

          {nameMatches.length > 0 && (
            <div
              className={`space-y-2 rounded-sm border px-3 py-2 text-sm sm:col-span-2 ${
                pegBoardMatch
                  ? "border-destructive/40 bg-destructive/10 text-destructive"
                  : "border-primary/15 bg-background/40 text-muted-foreground"
              }`}
            >
              <p className="font-mono text-xs uppercase tracking-[0.1em]">
                {pegBoardMatch
                  ? "Already on the peg board"
                  : `Already tracking "${name.trim()}"`}
              </p>
              <ul className="space-y-1">
                {nameMatches.map((match) => (
                  <li key={match.id}>
                    {match.brand} · {match.location}
                    {match.location === PEG_BOARD_LOCATION
                      ? ` (Row ${match.pegRow}, Slot ${match.pegSlot})`
                      : ""}{" "}
                    · count {match.count}
                  </li>
                ))}
              </ul>
              {pegBoardMatch && (
                <p>Pick a different location for this pot — a peg slot can only hold one.</p>
              )}
              {stashMatch && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={bumping}
                  onClick={() => bumpStashCount(stashMatch)}
                >
                  {bumping ? "Adding..." : `Add 1 to "${stashMatch.location}" instead`}
                </Button>
              )}
            </div>
          )}

          {isPegBoard && suggestedSlot && (
            <div className="flex items-center justify-between gap-4 rounded-sm border border-primary/15 bg-background/40 px-3 py-2 sm:col-span-2">
              <span className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
                Suggested slot: Row {suggestedSlot.row}, Slot {suggestedSlot.slot}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={suggestionApplied}
                onClick={applySuggestedSlot}
              >
                {suggestionApplied ? "Applied" : "Use this"}
              </Button>
            </div>
          )}

          {isPegBoard && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="pegRow">Peg Row</Label>
                <Select value={pegRow ? String(pegRow) : ""} onValueChange={onPegRowChange}>
                  <SelectTrigger id="pegRow">
                    <SelectValue placeholder="Row" />
                  </SelectTrigger>
                  <SelectContent>
                    {pegRows.map((row) => (
                      <SelectItem key={row} value={String(row)}>
                        Row {row}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pegSlot">Peg Slot</Label>
                <Select value={pegSlot ? String(pegSlot) : ""} onValueChange={onPegSlotChange}>
                  <SelectTrigger id="pegSlot">
                    <SelectValue placeholder="Slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {pegSlots.map((slot) => (
                      <SelectItem key={slot} value={String(slot)}>
                        Slot {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="flex gap-3 sm:col-span-2">
            <Button type="submit" disabled={submitting || deleting} className="flex-1">
              {submitting ? "Saving..." : isEditing ? "Save Changes" : "Save Paint"}
            </Button>
            {isEditing && (
              <Button
                type="button"
                variant="destructive"
                disabled={submitting || deleting}
                onClick={onDelete}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPaints;
