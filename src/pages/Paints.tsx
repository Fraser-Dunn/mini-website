import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowRight, Copy, Pencil, Trash2 } from "lucide-react";
import Spinner from "../components/Spinner";
import PegBoard from "../components/PegBoard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { swatchFor, tagColourFor } from "@/lib/tag-colours";
import { computeIdealLayout } from "@/lib/paint-layout";
import { deletePaint, updatePaint, type CreatePaintPayload } from "../services/paintsApi";
import {
  PEG_BOARD_LOCATION,
  PEG_BOARD_ROWS,
  PEG_BOARD_SLOTS_PER_ROW,
  PEG_BOARD_LAST_ROW_SLOTS,
  type Paint,
} from "../types/paint";

interface PaintsProps {
  data: Paint[];
  loading: boolean;
  isAuthed: boolean;
  onPaintsChanged: () => Promise<void>;
}

function toPayload(paint: Paint): CreatePaintPayload {
  const { id: _id, timestamp: _timestamp, userRef: _userRef, ...rest } = paint;
  return rest;
}

type SortKey = "name" | "brand" | "type" | "count" | "location";
type View = "table" | "board" | "reorganize";

const columns: [SortKey, string][] = [
  ["name", "Name"],
  ["brand", "Brand"],
  ["type", "Type"],
  ["count", "Count"],
  ["location", "Location"],
];

const TOTAL_SLOTS = (PEG_BOARD_ROWS - 1) * PEG_BOARD_SLOTS_PER_ROW + PEG_BOARD_LAST_ROW_SLOTS;

const Paints = ({ data, loading, isAuthed, onPaintsChanged }: PaintsProps) => {
  const [view, setView] = useState<View>("table");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [boardSearch, setBoardSearch] = useState("");

  const pegBoardPaints = useMemo(
    () => data.filter((paint) => paint.location === PEG_BOARD_LOCATION),
    [data]
  );

  const boardSearchTerm = boardSearch.trim();
  const boardMatch = useMemo(() => {
    if (!boardSearchTerm) return undefined;
    const term = boardSearchTerm.toUpperCase();
    return data.find((paint) => paint.name.toUpperCase().includes(term));
  }, [data, boardSearchTerm]);
  const highlightedPaintId =
    boardMatch && boardMatch.location === PEG_BOARD_LOCATION ? boardMatch.id : undefined;

  const filtered = useMemo(() => {
    const term = search.trim().toUpperCase();
    const list = term
      ? data.filter((paint) => paint.name.toUpperCase().includes(term))
      : data;
    return [...list].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, search, sortKey, sortDir]);

  const idealLayout = useMemo(() => computeIdealLayout(data), [data]);
  const misplaced = useMemo(
    () =>
      idealLayout.filter(
        (entry) => entry.paint.pegRow !== entry.idealRow || entry.paint.pegSlot !== entry.idealSlot
      ),
    [idealLayout]
  );
  const [applying, setApplying] = useState(false);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const handleDelete = async (paint: Paint) => {
    if (!window.confirm(`Delete "${paint.name}"? This can't be undone.`)) {
      return;
    }
    try {
      await deletePaint(paint.id);
      await onPaintsChanged();
      toast.success("Paint deleted");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to delete paint: ${message}`);
    }
  };

  const handleDropPaint = async (draggedId: string, targetRow: number, targetSlot: number) => {
    const dragged = pegBoardPaints.find((paint) => paint.id === draggedId);
    if (!dragged || (dragged.pegRow === targetRow && dragged.pegSlot === targetSlot)) {
      return;
    }

    const occupant = pegBoardPaints.find(
      (paint) =>
        paint.id !== draggedId && paint.pegRow === targetRow && paint.pegSlot === targetSlot
    );

    try {
      if (occupant) {
        await Promise.all([
          updatePaint(dragged.id, { ...toPayload(dragged), pegRow: targetRow, pegSlot: targetSlot }),
          updatePaint(occupant.id, {
            ...toPayload(occupant),
            pegRow: dragged.pegRow,
            pegSlot: dragged.pegSlot,
          }),
        ]);
        toast.success(`Swapped ${dragged.name} and ${occupant.name}`);
      } else {
        await updatePaint(dragged.id, {
          ...toPayload(dragged),
          pegRow: targetRow,
          pegSlot: targetSlot,
        });
        toast.success(`Moved ${dragged.name} to row ${targetRow}, slot ${targetSlot}`);
      }
      await onPaintsChanged();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to move paint: ${message}`);
    }
  };

  const handleApplyIdealLayout = async () => {
    if (misplaced.length === 0) return;
    if (
      !window.confirm(
        `Move ${misplaced.length} paint${misplaced.length === 1 ? "" : "s"} to their ideal slots? Update the physical board to match afterwards.`
      )
    ) {
      return;
    }

    setApplying(true);
    try {
      await Promise.all(
        misplaced.map(({ paint, idealRow, idealSlot }) =>
          updatePaint(paint.id, { ...toPayload(paint), pegRow: idealRow, pegSlot: idealSlot })
        )
      );
      await onPaintsChanged();
      toast.success(`Updated ${misplaced.length} paint${misplaced.length === 1 ? "" : "s"}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to apply layout: ${message}`);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  const brandCount = new Set(data.map((paint) => paint.brand)).size;

  return (
    <>
      <div className="border-b border-primary/15">
        <div className="container max-w-3xl py-16">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
            Paint rack · {data.length} paints · {brandCount} brands
          </p>
          <h1 className="mt-3 text-balance font-display text-4xl font-bold uppercase leading-[1.02] tracking-wide sm:text-5xl">
            The paint collection
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Every paint I own, and where to find it on the peg board.
          </p>
        </div>
      </div>

      <div className="py-10">
        <div className="container mb-6 flex flex-wrap items-center justify-between gap-4">
          <ToggleGroup
            type="single"
            variant="outline"
            value={view}
            onValueChange={(value) => value && setView(value as View)}
          >
            <ToggleGroupItem value="table">Table</ToggleGroupItem>
            <ToggleGroupItem value="board">Peg Board</ToggleGroupItem>
            {isAuthed && <ToggleGroupItem value="reorganize">Reorganize</ToggleGroupItem>}
          </ToggleGroup>

          {view === "table" && (
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name..."
              className="max-w-xs"
            />
          )}
          {view === "board" && (
            <Input
              value={boardSearch}
              onChange={(e) => setBoardSearch(e.target.value)}
              placeholder="Find a paint on the board..."
              className="max-w-xs"
            />
          )}
        </div>

        {view === "table" ? (
          <div className="container">
          <div className="overflow-x-auto rounded-sm border border-primary/15">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-primary/15 bg-card text-left">
                  {columns.map(([key, label]) => (
                    <th key={key} className="px-4 py-3">
                      <button
                        onClick={() => toggleSort(key)}
                        className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground hover:text-foreground"
                      >
                        {label}
                        {sortKey === key && (sortDir === "asc" ? " ▲" : " ▼")}
                      </button>
                    </th>
                  ))}
                  <th className="px-4 py-3">
                    <span className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
                      Colours
                    </span>
                  </th>
                  {isAuthed && <th className="px-4 py-3" />}
                </tr>
              </thead>
              <tbody>
                {filtered.map((paint) => {
                  const brandColour = tagColourFor(paint.brand);
                  const typeColour = tagColourFor(paint.type);
                  return (
                    <tr key={paint.id} className="border-b border-primary/10 last:border-0">
                      <td className="px-4 py-3 font-medium">
                        <span
                          className="mr-2 inline-block h-2.5 w-2.5 rounded-full align-middle"
                          style={{
                            backgroundColor: paint.hex ?? swatchFor(paint.parentColours[0]),
                          }}
                        />
                        {paint.name}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="rounded-sm px-2 py-0.5 text-xs font-medium"
                          style={{ backgroundColor: brandColour.bg, color: brandColour.text }}
                        >
                          {paint.brand}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="rounded-sm px-2 py-0.5 text-xs font-medium"
                          style={{ backgroundColor: typeColour.bg, color: typeColour.text }}
                        >
                          {paint.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 tabular-nums">{paint.count}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {paint.location === PEG_BOARD_LOCATION
                          ? `Peg board — row ${paint.pegRow}, slot ${paint.pegSlot}`
                          : paint.location}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {paint.parentColours.map((colour) => (
                            <span
                              key={colour}
                              className="rounded-sm px-2 py-0.5 text-xs font-medium text-white shadow-sm"
                              style={{ backgroundColor: swatchFor(colour) }}
                            >
                              {colour}
                            </span>
                          ))}
                        </div>
                      </td>
                      {isAuthed && (
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <Link
                              to={`/admin/paints/${paint.id}`}
                              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Edit
                            </Link>
                            <Link
                              to={`/admin/paints?from=${paint.id}`}
                              title="Duplicate this paint into a new location"
                              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                            >
                              <Copy className="h-3.5 w-3.5" />
                              Duplicate
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDelete(paint)}
                              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="p-6 text-center text-sm text-muted-foreground">
                {data.length === 0
                  ? "No paints catalogued yet."
                  : `No paints match “${search}”.`}
              </p>
            )}
          </div>
          </div>
        ) : view === "board" ? (
          <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8">
            <div className="rounded-sm border border-primary/15 bg-card p-6">
              <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-primary">
                Peg board · {pegBoardPaints.length}/{TOTAL_SLOTS} slots
              </p>
              {boardSearchTerm && (
                <p className="mb-4 text-xs text-muted-foreground">
                  {!boardMatch
                    ? `No paint named “${boardSearchTerm}” found.`
                    : boardMatch.location !== PEG_BOARD_LOCATION
                      ? `“${boardMatch.name}” isn't on the peg board (${boardMatch.location}).`
                      : `Found “${boardMatch.name}” — row ${boardMatch.pegRow}, slot ${boardMatch.pegSlot}.`}
                </p>
              )}
              <PegBoard
                paints={pegBoardPaints}
                highlightedPaintId={highlightedPaintId}
                isAuthed={isAuthed}
                onDropPaint={handleDropPaint}
              />
            </div>
          </div>
        ) : (
          <div className="container">
            <div className="rounded-sm border border-primary/15 bg-card p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
                  {misplaced.length === 0
                    ? `All ${idealLayout.length} paints are in their ideal spot`
                    : `${misplaced.length} of ${idealLayout.length} paints need to move`}
                </p>
                <Button
                  size="sm"
                  disabled={misplaced.length === 0 || applying}
                  onClick={handleApplyIdealLayout}
                >
                  {applying ? "Applying..." : "Apply ideal layout"}
                </Button>
              </div>

              {misplaced.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nothing to do — the board already matches the ideal type-then-alphabetical
                  order.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-sm border border-primary/15">
                  <table className="w-full min-w-[560px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-primary/15 bg-card text-left">
                        <th className="px-4 py-3">
                          <span className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
                            Paint
                          </span>
                        </th>
                        <th className="px-4 py-3">
                          <span className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
                            Type
                          </span>
                        </th>
                        <th className="px-4 py-3 text-right">
                          <span className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
                            Current
                          </span>
                        </th>
                        <th className="px-4 py-3 text-right">
                          <span className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
                            Ideal
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {misplaced.map(({ paint, idealRow, idealSlot }) => {
                        const typeColour = tagColourFor(paint.type);
                        return (
                          <tr key={paint.id} className="border-b border-primary/10 last:border-0">
                            <td className="px-4 py-3 font-medium">
                              <span
                                className="mr-2 inline-block h-2.5 w-2.5 rounded-full align-middle"
                                style={{
                                  backgroundColor: paint.hex ?? swatchFor(paint.parentColours[0]),
                                }}
                              />
                              {paint.name}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className="rounded-sm px-2 py-0.5 text-xs font-medium"
                                style={{
                                  backgroundColor: typeColour.bg,
                                  color: typeColour.text,
                                }}
                              >
                                {paint.type}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right text-muted-foreground">
                              {paint.pegRow && paint.pegSlot
                                ? `Row ${paint.pegRow}, Slot ${paint.pegSlot}`
                                : "Not on board"}
                            </td>
                            <td className="px-4 py-3">
                              <span className="flex items-center justify-end gap-2 text-foreground">
                                <ArrowRight className="h-3.5 w-3.5 text-primary" />
                                Row {idealRow}, Slot {idealSlot}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Paints;
