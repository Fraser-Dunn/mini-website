import { Loader2 } from "lucide-react";

function Spinner() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-background/90">
      <Loader2 className="h-9 w-9 animate-spin text-primary" />
      <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
        Loading the archive
      </span>
    </div>
  );
}

export default Spinner;
