import {
  PEG_BOARD_LOCATION,
  PAINT_TYPE_ORDER,
  allBoardPositions,
  type Paint,
} from "../types/paint";

export interface LayoutAssignment {
  paint: Paint;
  idealRow: number;
  idealSlot: number;
}

function typeRank(type: string, unknownRank: Map<string, number>): number {
  const known = PAINT_TYPE_ORDER.indexOf(type);
  if (known !== -1) return known;
  return PAINT_TYPE_ORDER.length + (unknownRank.get(type) ?? 0);
}

// Computes where every peg-board paint *should* sit if the board were packed
// perfectly: grouped by type in PAINT_TYPE_ORDER (unfamiliar types appended
// as new sections, ordered by whichever was catalogued earliest), then
// alphabetical by name within each section, filling slots row by row from
// the top. Paints not stored on the peg board are ignored entirely.
export function computeIdealLayout(paints: Paint[]): LayoutAssignment[] {
  const boardPaints = paints.filter((paint) => paint.location === PEG_BOARD_LOCATION);

  const earliestByType = new Map<string, string>();
  boardPaints.forEach((paint) => {
    if (PAINT_TYPE_ORDER.includes(paint.type)) return;
    const existing = earliestByType.get(paint.type);
    const timestamp = paint.timestamp ?? "";
    if (existing === undefined || timestamp < existing) {
      earliestByType.set(paint.type, timestamp);
    }
  });
  const unknownTypes = [...earliestByType.keys()].sort((a, b) =>
    (earliestByType.get(a) ?? "").localeCompare(earliestByType.get(b) ?? "")
  );
  const unknownRank = new Map(unknownTypes.map((type, index) => [type, index]));

  const sorted = [...boardPaints].sort((a, b) => {
    const rankDiff = typeRank(a.type, unknownRank) - typeRank(b.type, unknownRank);
    if (rankDiff !== 0) return rankDiff;
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });

  const positions = allBoardPositions();

  return sorted
    .map((paint, index) => ({ paint, pos: positions[index] }))
    .filter(
      (entry): entry is { paint: Paint; pos: { row: number; slot: number } } =>
        Boolean(entry.pos)
    )
    .map(({ paint, pos }) => ({ paint, idealRow: pos.row, idealSlot: pos.slot }));
}

export interface SuggestedSlot {
  row: number;
  slot: number;
}

// Where a not-yet-saved paint would land if it were added to the board right
// now, given the other paints already there. `excludeId` drops the paint
// currently being edited from the comparison set, so re-suggesting a slot
// for it isn't skewed by its own old entry.
export function computeSuggestedSlot(
  existingPaints: Paint[],
  candidate: { name: string; type: string },
  excludeId?: string
): SuggestedSlot | null {
  const CANDIDATE_ID = "__candidate__";
  const base = existingPaints.filter((paint) => paint.id !== excludeId);
  const candidatePaint: Paint = {
    id: CANDIDATE_ID,
    brand: "",
    name: candidate.name,
    parentColours: [],
    type: candidate.type,
    count: 0,
    location: PEG_BOARD_LOCATION,
    timestamp: new Date().toISOString(),
  };

  const layout = computeIdealLayout([...base, candidatePaint]);
  const found = layout.find((entry) => entry.paint.id === CANDIDATE_ID);
  return found ? { row: found.idealRow, slot: found.idealSlot } : null;
}
