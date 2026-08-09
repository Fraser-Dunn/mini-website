export interface Paint {
  id: string;
  brand: string;
  name: string;
  parentColours: string[];
  type: string;
  count: number;
  location: string;
  hex?: string;
  pegRow?: number;
  pegSlot?: number;
  timestamp?: string;
  userRef?: string;
}

export const PEG_BOARD_LOCATION = "Peg board";
export const PEG_BOARD_ROWS = 12;
export const PEG_BOARD_SLOTS_PER_ROW = 15;
export const PEG_BOARD_LAST_ROW_SLOTS = 10;

// The physical order paint Type sections run in on the board. A type not in
// this list is treated as a new section appended after these, ordered by
// whenever it was first catalogued.
export const PAINT_TYPE_ORDER = ["Contrast", "Base", "Technical", "Metallic", "Layer"];

export function slotsInRow(row: number): number {
  return row === PEG_BOARD_ROWS ? PEG_BOARD_LAST_ROW_SLOTS : PEG_BOARD_SLOTS_PER_ROW;
}

// Maps each physical column (0-indexed) in a row to a logical slot number
// (1-based, matching what's stored/selected as pegSlot), or null where there
// is no peg. Every row is a full run of PEG_BOARD_SLOTS_PER_ROW slots except
// the last, which is missing pegs in the middle: 5 slots, a 5-wide gap, then
// 5 more slots (5 + 5 + 5 = 15, still totalling PEG_BOARD_LAST_ROW_SLOTS = 10
// real slots).
export function rowLayout(row: number): Array<number | null> {
  if (row !== PEG_BOARD_ROWS) {
    return Array.from({ length: PEG_BOARD_SLOTS_PER_ROW }, (_, i) => i + 1);
  }

  const gapSize = PEG_BOARD_SLOTS_PER_ROW - PEG_BOARD_LAST_ROW_SLOTS;
  const halfWidth = PEG_BOARD_LAST_ROW_SLOTS / 2;
  let slot = 1;

  return Array.from({ length: PEG_BOARD_SLOTS_PER_ROW }, (_, column) => {
    const inGap = column >= halfWidth && column < halfWidth + gapSize;
    return inGap ? null : slot++;
  });
}

// Every real (row, slot) position on the board, in left-to-right,
// top-to-bottom order - i.e. the order a fully-packed board would fill in.
export function allBoardPositions(): Array<{ row: number; slot: number }> {
  const positions: Array<{ row: number; slot: number }> = [];
  for (let row = 1; row <= PEG_BOARD_ROWS; row++) {
    for (const slot of rowLayout(row)) {
      if (slot !== null) {
        positions.push({ row, slot });
      }
    }
  }
  return positions;
}
