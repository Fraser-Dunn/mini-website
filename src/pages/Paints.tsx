import { useMemo, useState } from "react";
import Spinner from "../components/Spinner";
import PegBoard from "../components/PegBoard";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
}

type SortKey = "name" | "brand" | "type" | "count" | "location";
type View = "table" | "board";

const columns: [SortKey, string][] = [
  ["name", "Name"],
  ["brand", "Brand"],
  ["type", "Type"],
  ["count", "Count"],
  ["location", "Location"],
];

const TOTAL_SLOTS = (PEG_BOARD_ROWS - 1) * PEG_BOARD_SLOTS_PER_ROW + PEG_BOARD_LAST_ROW_SLOTS;

const Paints = ({ data, loading }: PaintsProps) => {
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

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
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

      <div className="container py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <ToggleGroup
            type="single"
            variant="outline"
            value={view}
            onValueChange={(value) => value && setView(value as View)}
          >
            <ToggleGroupItem value="table">Table</ToggleGroupItem>
            <ToggleGroupItem value="board">Peg Board</ToggleGroupItem>
          </ToggleGroup>

          {view === "table" && (
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name..."
              className="max-w-xs"
            />
          )}
        </div>

        {view === "table" ? (
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
                </tr>
              </thead>
              <tbody>
                {filtered.map((paint) => (
                  <tr key={paint.id} className="border-b border-primary/10 last:border-0">
                    <td className="px-4 py-3 font-medium">{paint.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{paint.brand}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-sm border border-primary/20 px-2 py-0.5 text-xs text-muted-foreground">
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
                            className="rounded-sm border border-primary/20 px-2 py-0.5 text-xs text-muted-foreground"
                          >
                            {colour}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
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
        ) : (
          <div className="rounded-sm border border-primary/15 bg-card p-6">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-4">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
                Peg board · {pegBoardPaints.length}/{TOTAL_SLOTS} slots
              </p>
              <Input
                value={boardSearch}
                onChange={(e) => setBoardSearch(e.target.value)}
                placeholder="Find a paint on the board..."
                className="max-w-xs"
              />
            </div>
            {boardSearchTerm && (
              <p className="mb-4 text-xs text-muted-foreground">
                {!boardMatch
                  ? `No paint named “${boardSearchTerm}” found.`
                  : boardMatch.location !== PEG_BOARD_LOCATION
                    ? `“${boardMatch.name}” isn't on the peg board (${boardMatch.location}).`
                    : `Found “${boardMatch.name}” — row ${boardMatch.pegRow}, slot ${boardMatch.pegSlot}.`}
              </p>
            )}
            <PegBoard paints={pegBoardPaints} highlightedPaintId={highlightedPaintId} />
          </div>
        )}
      </div>
    </>
  );
};

export default Paints;
