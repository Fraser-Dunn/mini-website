import { SearchX } from "lucide-react";

const NoResults = () => {
  return (
    <div className="container flex flex-col items-center justify-center gap-3 py-24 text-center">
      <SearchX className="h-10 w-10 text-muted-foreground" />
      <h1 className="text-xl font-semibold">Sorry, no mini by that name here!</h1>
      <h2 className="text-sm text-muted-foreground">
        Please ensure that spelling is accurate.
      </h2>
    </div>
  );
};

export default NoResults;
