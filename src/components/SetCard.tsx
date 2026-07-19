import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface SetCardProps {
  firstOfSetImg: string;
  miniSet: string;
  count: number;
}

const SetCard = ({ firstOfSetImg, miniSet, count }: SetCardProps) => {
  return (
    <Link
      to={`/gallery?setFilter=${miniSet}`}
      className="group block overflow-hidden rounded-sm border border-primary/15 bg-card transition-shadow duration-300 hover:shadow-[0_0_0_1px_rgba(255,122,26,.4),0_20px_45px_-24px_rgba(255,122,26,.45)]"
    >
      <AspectRatio ratio={4 / 5} className="overflow-hidden bg-plate">
        <img
          src={firstOfSetImg}
          alt={miniSet}
          className="h-full w-full object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      </AspectRatio>
      <div className="border-t border-primary/15 px-4 py-3">
        <span className="block font-mono text-[0.65rem] uppercase tracking-[0.1em] text-primary">
          {count} {count === 1 ? "miniature" : "miniatures"}
        </span>
        <h3 className="mt-1 line-clamp-2 font-display text-lg font-bold uppercase leading-tight tracking-wide text-foreground">
          {miniSet}
        </h3>
        <span className="mt-1.5 inline-flex items-center gap-1 text-xs uppercase tracking-[0.1em] text-muted-foreground transition-colors group-hover:text-primary">
          View set
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
};

export default SetCard;
