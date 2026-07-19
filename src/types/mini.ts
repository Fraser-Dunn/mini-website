export type Size = "Tiny" | "Small" | "Medium" | "Large" | "Huge" | "Gargantuan";

export interface Mini {
  id: string;
  name: string;
  brand: string;
  maker: string;
  set: string;
  number: number | string;
  quantity: number | string;
  race: string;
  gender: string;
  type: string;
  size: Size;
  rarity: string;
  damaged: boolean;
  statblock: string;
  imageUrls: string[];
  timestamp?: unknown;
  userRef?: string;
}

export type FilterKey = "set" | "size" | "race" | "type";

export interface FilterEntry {
  key: FilterKey;
  value: string;
}

export type Theme = "light" | "dark";
