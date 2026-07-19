import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  { label: "Set", key: "set" },
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
    <div className="container max-w-4xl py-8">
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="text-2xl">{currentMini.name}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 pt-6 md:grid-cols-2">
          <dl className="space-y-2">
            {stats.map(({ label, key }) => (
              <div key={key}>
                <div className="flex justify-between py-1 text-sm">
                  <dt className="font-semibold">{label}</dt>
                  <dd className="text-muted-foreground">{String(currentMini[key])}</dd>
                </div>
                <Separator />
              </div>
            ))}
            <div className="flex items-center justify-between py-1 text-sm">
              <dt className="font-semibold">Statblock</dt>
              <dd>
                <a
                  href={currentMini.statblock}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline underline-offset-2"
                >
                  View
                </a>
              </dd>
            </div>
            {currentMini.damaged && (
              <Badge variant="destructive" className="mt-2">
                Damaged
              </Badge>
            )}
          </dl>
          <AspectRatio ratio={1} className="overflow-hidden rounded-md border">
            <img
              src={currentMini.imageUrls[0]}
              alt={currentMini.name}
              className="h-full w-full object-cover"
            />
          </AspectRatio>
        </CardContent>
      </Card>
    </div>
  );
};

export default MiniInfo;
