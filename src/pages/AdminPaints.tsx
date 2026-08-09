import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import AdminNav from "../components/AdminNav";
import { createPaint, deletePaint, updatePaint } from "../services/paintsApi";
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
  const navigate = useNavigate();
  const editingPaint = paintId ? paints.find((p) => p.id === paintId) : undefined;
  const isEditing = Boolean(paintId);

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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingPaint?.id]);

  const { brand, name, parentColours, type, count, location, hex, pegRow, pegSlot } =
    formData;

  const isPegBoard = location === PEG_BOARD_LOCATION;
  const pegSlots = Array.from({ length: slotsInRow(pegRow ?? 1) }, (_, i) => i + 1);

  const brandSuggestions = useMemo(
    () => [...new Set(paints.map((p) => p.brand))].sort(),
    [paints]
  );
  const typeSuggestions = useMemo(
    () => [...new Set(paints.map((p) => p.type))].sort(),
    [paints]
  );
  const colourSuggestions = useMemo(
    () => [...new Set(paints.flatMap((p) => p.parentColours))].sort(),
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
        {isEditing ? "Editing" : "New entry"}
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide">
        {isEditing ? "Edit Paint" : "Catalogue a Paint"}
      </h1>
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
