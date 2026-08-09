import { useEffect, useRef, useState, type DragEvent } from "react";
import { PEG_BOARD_ROWS, PEG_BOARD_SLOTS_PER_ROW, rowLayout } from "../types/paint";
import { swatchFor } from "@/lib/tag-colours";
import type { Paint } from "../types/paint";

interface PegBoardProps {
  paints: Paint[];
  highlightedPaintId?: string;
  isAuthed?: boolean;
  onDropPaint?: (draggedId: string, targetRow: number, targetSlot: number) => void;
}

const PegBoard = ({ paints, highlightedPaintId, isAuthed, onDropPaint }: PegBoardProps) => {
  const highlightedRef = useRef<HTMLDivElement>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);

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

  const onDragStart = (e: DragEvent<HTMLDivElement>, paintId: string) => {
    if (!isAuthed) return;
    e.dataTransfer.setData("text/plain", paintId);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>, key: string) => {
    if (!isAuthed) return;
    e.preventDefault();
    setDragOverKey((prev) => (prev === key ? prev : key));
  };

  const onDragLeave = (key: string) => {
    setDragOverKey((prev) => (prev === key ? null : prev));
  };

  const onDrop = (e: DragEvent<HTMLDivElement>, row: number, slot: number) => {
    if (!isAuthed) return;
    e.preventDefault();
    setDragOverKey(null);
    const draggedId = e.dataTransfer.getData("text/plain");
    if (draggedId) {
      onDropPaint?.(draggedId, row, slot);
    }
  };

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
                const key = `${row}-${slot}`;
                const isDragOver = dragOverKey === key;
                return (
                  <div
                    key={column}
                    ref={isHighlighted ? highlightedRef : undefined}
                    title={
                      paint
                        ? `${paint.name} (${paint.brand}) — row ${row}, slot ${slot}`
                        : `Row ${row}, slot ${slot} — empty`
                    }
                    draggable={isAuthed && Boolean(paint)}
                    onDragStart={(e) => paint && onDragStart(e, paint.id)}
                    onDragOver={(e) => onDragOver(e, key)}
                    onDragLeave={() => onDragLeave(key)}
                    onDrop={(e) => onDrop(e, row, slot)}
                    className={`relative h-24 w-24 flex-none rounded-[18%] transition-transform ${
                      isAuthed && paint ? "cursor-grab active:cursor-grabbing" : ""
                    } ${paint ? "hover:z-10 hover:scale-105" : ""} ${
                      isHighlighted ? "z-20 animate-pulse-glow" : ""
                    } ${
                      isDragOver
                        ? "z-10 ring-2 ring-primary ring-offset-2 ring-offset-background"
                        : ""
                    } ${!paint ? "border border-dashed" : ""}`}
                    style={paint ? undefined : { borderColor: "rgb(var(--primary) / 0.2)" }}
                  >
                    {paint && (
                      <div className="h-full w-full overflow-hidden rounded-[18%] shadow-sm">
                        <div className="h-[26%] w-full border-b border-black/25 bg-plate" />
                        <div
                          className="flex h-[74%] w-full items-center justify-center"
                          style={{ backgroundColor: paint.hex ?? swatchFor(paint.parentColours[0]) }}
                        >
                          <p
                            className="line-clamp-3 px-1.5 text-center text-[9px] font-semibold leading-[1.2] text-white"
                            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.9), 0 0 6px rgba(0,0,0,0.6)" }}
                          >
                            {paint.name}
                          </p>
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
