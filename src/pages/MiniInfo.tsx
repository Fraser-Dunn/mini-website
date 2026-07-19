import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import type { Mini } from "../types/mini";

interface MiniInfoProps {
  data: Mini[];
  loading: boolean;
}

const stats: { label: string; key: keyof Mini }[] = [
  { label: "Rarity", key: "rarity" },
  { label: "Gender", key: "gender" },
  { label: "Race", key: "race" },
  { label: "Type", key: "type" },
  { label: "Size", key: "size" },
  { label: "Set Number", key: "number" },
  { label: "Quantity", key: "quantity" },
  { label: "Maker", key: "maker" },
  { label: "Brand", key: "brand" },
];

const MiniInfo = ({ data, loading }: MiniInfoProps) => {
  const params = useParams<{ miniId: string }>();

  if (loading) {
    return <Spinner />;
  }

  const currentMini = data.find((mini) => mini.id === params.miniId);

  if (!currentMini) {
    return null;
  }

  return (
    <div className="container max-w-5xl py-14">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
        {currentMini.set}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="text-balance font-display text-4xl font-bold uppercase leading-[1.02] tracking-wide">
          {currentMini.name}
        </h1>
        {currentMini.damaged && <Badge variant="destructive">Damaged</Badge>}
      </div>

      <div className="mt-10 grid items-start gap-10 md:grid-cols-[minmax(0,26rem)_1fr]">
        <div className="overflow-hidden rounded-sm border border-primary/15">
          <AspectRatio ratio={4 / 5} className="bg-plate">
            <img
              src={currentMini.imageUrls[0]}
              alt={currentMini.name}
              className="h-full w-full object-contain p-6"
            />
          </AspectRatio>
        </div>

        <dl className="divide-y divide-border">
          {stats.map(({ label, key }) => (
            <div key={key} className="flex items-center justify-between py-3 text-sm">
              <dt className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
                {label}
              </dt>
              <dd className="font-medium">{String(currentMini[key])}</dd>
            </div>
          ))}
          <div className="flex items-center justify-between py-3 text-sm">
            <dt className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
              Statblock
            </dt>
            <dd>
              <a
                href={currentMini.statblock}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
              >
                View reference
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default MiniInfo;
