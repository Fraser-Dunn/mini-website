import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import type { Mini } from "../types/mini";

interface MiniCardProps {
  mini: Mini;
}

const MiniCard = ({ mini }: MiniCardProps) => {
  return (
    <Link to={`/miniInfo/${mini.id}`} className="group block">
      <Card className="overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
        <CardHeader className="p-0">
          <AspectRatio ratio={1}>
            <img
              src={mini.imageUrls[0]}
              alt={mini.name}
              className="h-full w-full object-cover"
            />
          </AspectRatio>
        </CardHeader>
        <CardContent className="space-y-1 p-4">
          <CardTitle className="line-clamp-1 text-base transition-colors group-hover:text-primary">
            {mini.name}
          </CardTitle>
          <Badge variant="secondary">{mini.size}</Badge>
        </CardContent>
        <CardFooter className="p-4 pt-0 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{mini.set}</span>
          <span className="ml-1">(#{mini.number})</span>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default MiniCard;
