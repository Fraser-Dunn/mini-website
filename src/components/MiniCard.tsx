import { Link } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import type { Mini } from "../types/mini";

interface MiniCardProps {
  mini: Mini;
}

const MiniCard = ({ mini }: MiniCardProps) => {
  return (
    <Link
      to={`/miniInfo/${mini.id}`}
      className="group block overflow-hidden rounded-sm border border-primary/15 bg-card transition-shadow duration-300 hover:shadow-[0_0_0_1px_rgba(255,122,26,.4),0_20px_45px_-24px_rgba(255,122,26,.45)]"
    >
      <AspectRatio ratio={4 / 5} className="overflow-hidden bg-plate">
        <img
          src={mini.imageUrls[0]}
          alt={mini.name}
          className="h-full w-full object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      </AspectRatio>
      <div className="border-t border-primary/15 px-4 py-3">
        <span className="block font-mono text-[0.65rem] uppercase tracking-[0.1em] text-primary">
          {mini.set}
        </span>
        <h3 className="mt-1 line-clamp-1 font-display text-lg font-bold uppercase leading-tight tracking-wide text-foreground">
          {mini.name}
        </h3>
        <span className="text-xs text-muted-foreground">{mini.size}</span>
      </div>
    </Link>
  );
};

export default MiniCard;
