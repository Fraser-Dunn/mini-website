import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="container flex flex-col items-center justify-center gap-4 py-28 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">Error</p>
      <h1 className="font-display text-7xl font-bold uppercase leading-none tracking-wide sm:text-8xl">
        404
      </h1>
      <p className="text-muted-foreground">This page doesn&apos;t exist in the archive.</p>
      <Button asChild className="mt-2">
        <Link to="/">
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
      </Button>
    </div>
  );
};

export default NotFound;
