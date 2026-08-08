// Real-world colour name -> swatch hex, used for Parent Colours (the actual
// paint colour should look like that colour).
const COLOUR_SWATCHES: Record<string, string> = {
  black: "#242220",
  white: "#f1e7d8",
  grey: "#8a8a8a",
  gray: "#8a8a8a",
  red: "#c23b3b",
  blue: "#3b6bc2",
  green: "#3b8f5e",
  yellow: "#d4b23c",
  brown: "#8a5a3b",
  purple: "#7a4fa3",
  orange: "#d4763c",
  pink: "#c9709b",
  metallic: "#a8a094",
};
const FALLBACK_SWATCH = "#5a4a38";

export function swatchFor(colour?: string): string {
  if (!colour) return FALLBACK_SWATCH;
  return COLOUR_SWATCHES[colour.toLowerCase()] ?? FALLBACK_SWATCH;
}

export interface TagColour {
  bg: string;
  text: string;
}

// Notion-style tag colouring for values with no inherent real-world colour
// (brand, type): each distinct string gets a consistent colour from this
// palette, derived from a hash of the string, rather than a fixed mapping.
const TAG_PALETTE: TagColour[] = [
  { bg: "#2f3f5c", text: "#cddaf5" },
  { bg: "#4a3564", text: "#e2d3f5" },
  { bg: "#5c3148", text: "#f5d6e6" },
  { bg: "#2f5c50", text: "#cdf2e6" },
  { bg: "#5c4f2f", text: "#f5e6c8" },
  { bg: "#2f4f5c", text: "#cdebf5" },
  { bg: "#4f5c2f", text: "#e9f5cd" },
  { bg: "#5c3a2f", text: "#f5ddcf" },
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function tagColourFor(value: string): TagColour {
  return TAG_PALETTE[hashString(value) % TAG_PALETTE.length];
}
