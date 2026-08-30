import { swatchFor } from "@/lib/tag-colours";
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

// Standard RGB hex -> HSL, used to sort paints by hue rather than name.
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const [r, g, b] = (hex.match(/[0-9a-fA-F]{2}/g) ?? ["00", "00", "00"])
    .slice(0, 3)
    .map((part) => parseInt(part, 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return { h: h * 60, s, l };
}

// A paint's position in colour order: greys/blacks/whites (low saturation,
// where "hue" is meaningless) sort first by lightness, then hued colours
// sort by hue and finally lightness. Based on the same swatch used to render
// the paint everywhere else, so what you see is what it sorts by.
function colourSortKey(paint: Paint): [number, number, number] {
  const hex = paint.hex ?? swatchFor(paint.parentColours[0]);
  const { h, s, l } = hexToHsl(hex);
  const achromatic = s < 0.15;
  return achromatic ? [0, l, 0] : [1, h, l];
}

function compareColourKeys(a: [number, number, number], b: [number, number, number]): number {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return 0;
}

// Computes where every peg-board paint *should* sit if the board were packed
// perfectly: grouped by type in PAINT_TYPE_ORDER (unfamiliar types appended
// as new sections, ordered by whichever was catalogued earliest), then by
// colour/hue within each section - so a red stays grouped with other reds of
// the same type, without a same-hued paint of a different type ending up
// next to it - filling slots row by row from the top. Paints not stored on
// the peg board are ignored entirely.
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
    const colourDiff = compareColourKeys(colourSortKey(a), colourSortKey(b));
    if (colourDiff !== 0) return colourDiff;
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

// The first physically-empty slot on the board, in reading order. New paints
// get dropped here rather than at their "ideal" sorted position, since the
// board is rarely fully reorganized - the Reorganize tool is what moves
// things to their ideal spot later. `excludeId` drops the paint currently
// being edited from the occupancy check, so it doesn't block on its own old
// slot.
export function getNextAvailableSlot(
  existingPaints: Paint[],
  excludeId?: string
): SuggestedSlot | null {
  const occupied = new Set(
    existingPaints
      .filter((paint) => paint.location === PEG_BOARD_LOCATION && paint.id !== excludeId)
      .map((paint) => `${paint.pegRow}-${paint.pegSlot}`)
  );

  const free = allBoardPositions().find(({ row, slot }) => !occupied.has(`${row}-${slot}`));
  return free ?? null;
}
