import { SearchX } from "lucide-react";

const NoResults = () => {
  return (
    <div className="container flex flex-col items-center justify-center gap-3 py-24 text-center">
      <SearchX className="h-10 w-10 text-primary" />
      <h1 className="font-display text-2xl font-bold uppercase tracking-wide">
        No mini by that name
      </h1>
      <h2 className="text-sm text-muted-foreground">
        Please ensure that spelling is accurate.
      </h2>
    </div>
  );
};

export default NoResults;
