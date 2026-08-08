import { useEffect, useRef } from "react";
import { PEG_BOARD_ROWS, PEG_BOARD_SLOTS_PER_ROW, rowLayout } from "../types/paint";
import { swatchFor } from "@/lib/tag-colours";
import type { Paint } from "../types/paint";

interface PegBoardProps {
  paints: Paint[];
  highlightedPaintId?: string;
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
      highlightedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [highlightedPaintId]);

  const rows = Array.from({ length: PEG_BOARD_ROWS }, (_, i) => i + 1);

  return (
    <div className="-m-6 overflow-x-auto p-6">
      <div className="w-fit space-y-3">
        {rows.map((row) => {
          const layout = rowLayout(row);
          return (
            <div
              key={row}
              className="grid gap-2"
              style={{ gridTemplateColumns: `repeat(${PEG_BOARD_SLOTS_PER_ROW}, minmax(104px, 1fr))` }}
            >
              {layout.map((slot, column) => {
                if (slot === null) {
                  return <div key={column} />;
                }
                const paint = bySlot.get(`${row}-${slot}`);
                const isHighlighted = paint !== undefined && paint.id === highlightedPaintId;
                return (
                  <div
                    key={column}
                    ref={isHighlighted ? highlightedRef : undefined}
                    title={
                      paint
                        ? `${paint.name} (${paint.brand}) — row ${row}, slot ${slot}`
                        : `Row ${row}, slot ${slot} — empty`
                    }
                    className={
                      paint
                        ? `relative h-24 w-24 flex-none rounded-[18%] transition-transform hover:z-10 hover:scale-105 ${isHighlighted ? "z-20 animate-pulse-glow" : ""}`
                        : "relative h-24 w-24 flex-none rounded-[18%] border border-dashed"
                    }
                    style={paint ? undefined : { borderColor: "rgb(var(--primary) / 0.2)" }}
                  >
                    {paint && (
                      <div className="h-full w-full overflow-hidden rounded-[18%] shadow-sm">
                        <div className="h-[26%] w-full border-b border-black/25 bg-plate" />
                        <div
                          className="relative h-[74%] w-full"
                          style={{ backgroundColor: paint.hex ?? swatchFor(paint.parentColours[0]) }}
                        >
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-1.5 pb-1.5 pt-4">
                            <p className="line-clamp-3 text-center text-[9px] font-medium leading-[1.2] text-white">
                              {paint.name}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PegBoard;
