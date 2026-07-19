import { useNavigate } from "react-router-dom";
import type { KeyboardEvent } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const SearchBar = () => {
  const navigate = useNavigate();
  const enterCheck = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      navigate(`/search?term=${e.currentTarget.value}`);
    }
  };

  return (
    <div className="relative w-full max-w-xs">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        onKeyUp={enterCheck}
        type="text"
        placeholder="Search by name of mini"
        className="pl-8"
      />
    </div>
  );
};

export default SearchBar;
