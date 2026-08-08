export interface Paint {
  id: string;
  brand: string;
  name: string;
  parentColours: string[];
  type: string;
  count: number;
  location: string;
  pegRow?: number;
  pegSlot?: number;
  timestamp?: string;
  userRef?: string;
}

export const PEG_BOARD_LOCATION = "Peg board";
export const PEG_BOARD_ROWS = 12;
export const PEG_BOARD_SLOTS_PER_ROW = 15;
export const PEG_BOARD_LAST_ROW_SLOTS = 10;

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
