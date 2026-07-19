import { Loader2 } from "lucide-react";

function Spinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );
}

export default Spinner;
