import { useEffect, useRef } from "react";
import { PEG_BOARD_ROWS, PEG_BOARD_SLOTS_PER_ROW, rowLayout } from "../types/paint";
import type { Paint } from "../types/paint";

interface PegBoardProps {
  paints: Paint[];
  highlightedPaintId?: string;
}

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

function swatchFor(colour?: string): string {
  if (!colour) return FALLBACK_SWATCH;
  return COLOUR_SWATCHES[colour.toLowerCase()] ?? FALLBACK_SWATCH;
}

const PegBoard = ({ paints, highlightedPaintId }: PegBoardProps) => {
  const highlightedRef = useRef<HTMLDivElement>(null);

  const bySlot = new Map<string, Paint>();
  paints.forEach((paint) => {
    if (paint.pegRow !== undefined && paint.pegSlot !== undefined) {
      bySlot.set(`${paint.pegRow}-${paint.pegSlot}`, paint);
    }
  });

  useEffect(() => {
    if (highlightedPaintId && highlightedRef.current) {
      highlightedRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlightedPaintId]);

  const rows = Array.from({ length: PEG_BOARD_ROWS }, (_, i) => i + 1);

  return (
    <div className="space-y-2">
      {rows.map((row) => {
        const layout = rowLayout(row);
        return (
          <div
            key={row}
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${PEG_BOARD_SLOTS_PER_ROW}, minmax(0, 1fr))` }}
          >
            {layout.map((slot, column) => {
              if (slot === null) {
                return <div key={column} />;
              }
              const paint = bySlot.get(`${row}-${slot}`);
              const isHighlighted = paint !== undefined && paint.id === highlightedPaintId;
              return (
                <div key={column} className="group/pot relative aspect-square">
                  <div
                    ref={isHighlighted ? highlightedRef : undefined}
                    title={paint ? undefined : `Row ${row}, slot ${slot} — empty`}
                    aria-label={
                      paint
                        ? `${paint.name} (${paint.brand}) — row ${row}, slot ${slot}`
                        : undefined
                    }
                    className={
                      paint
                        ? `absolute inset-[12%] flex flex-col overflow-hidden rounded-[22%] shadow-sm transition-transform hover:z-10 hover:scale-110 ${isHighlighted ? "z-20 animate-pulse-glow" : ""}`
                        : "absolute inset-[12%] rounded-[22%] border border-dashed transition-transform hover:z-10 hover:scale-110"
                    }
                    style={paint ? undefined : { borderColor: "rgb(var(--primary) / 0.2)" }}
                  >
                    {paint && (
                      <>
                        <div className="h-[30%] w-full border-b border-black/25 bg-plate" />
                        <div
                          className="h-[70%] w-full"
                          style={{ backgroundColor: swatchFor(paint.parentColours[0]) }}
                        />
                      </>
                    )}
                  </div>
                  {paint && (
                    <div className="pointer-events-none absolute -top-1.5 left-1/2 z-30 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-sm border border-primary/30 bg-popover px-2 py-1 text-[0.65rem] text-foreground opacity-0 shadow-lg transition-opacity duration-150 group-hover/pot:opacity-100">
                      {paint.name}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default PegBoard;
