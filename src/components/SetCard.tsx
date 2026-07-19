import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";

interface SetCardProps {
  firstOfSetImg: string;
  miniSet: string;
}

const SetCard = ({ firstOfSetImg, miniSet }: SetCardProps) => {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
      <CardHeader className="bg-primary p-3 text-primary-foreground">
        <CardTitle className="line-clamp-1 text-base">{miniSet}</CardTitle>
      </CardHeader>
      <Link to={`/gallery?setFilter=${miniSet}`}>
        <AspectRatio ratio={3 / 4}>
          <img src={firstOfSetImg} alt={miniSet} className="h-full w-full object-cover" />
        </AspectRatio>
      </Link>
      <CardContent className="p-4">
        <Button asChild variant="outline" className="w-full">
          <Link to={`/gallery?setFilter=${miniSet}`}>View Set</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default SetCard;
