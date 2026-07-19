import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import type { Mini } from "../types/mini";

interface SearchBarProps {
  data: Mini[];
  className?: string;
}

const MAX_RESULTS = 6;

const SearchBar = ({ data, className }: SearchBarProps) => {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const results =
    value.trim().length > 0
      ? data
          .filter((mini) => mini.name.toUpperCase().includes(value.toUpperCase()))
          .slice(0, MAX_RESULTS)
      : [];

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const goToResults = () => {
    if (!value.trim()) return;
    navigate(`/search?term=${value}`);
    setOpen(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      goToResults();
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const onSelect = () => {
    setValue("");
    setOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-48 transition-[width] duration-300 ease-out focus-within:w-80",
        className
      )}
    >
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setOpen(true);
        }}
        onFocus={() => value.trim().length > 0 && setOpen(true)}
        onKeyDown={onKeyDown}
        type="text"
        placeholder="Search minis…"
        className="h-10 pl-9 text-sm"
      />

      {open && value.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-sm border border-primary/20 bg-popover shadow-xl">
          {results.length > 0 ? (
            <>
              <ul className="max-h-80 overflow-y-auto">
                {results.map((mini) => (
                  <li key={mini.id}>
                    <Link
                      to={`/miniInfo/${mini.id}`}
                      onClick={onSelect}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-accent"
                    >
                      <img
                        src={mini.imageUrls[0]}
                        alt=""
                        className="h-10 w-10 flex-shrink-0 rounded-sm bg-plate object-contain p-1"
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-sm text-foreground">
                          {mini.name}
                        </span>
                        <span className="block truncate font-mono text-[0.65rem] uppercase tracking-wide text-muted-foreground">
                          {mini.set}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <button
                onClick={goToResults}
                className="w-full border-t border-primary/10 px-3 py-2 text-left font-mono text-xs uppercase tracking-wide text-primary hover:bg-accent"
              >
                View all results for &ldquo;{value}&rdquo;
              </button>
            </>
          ) : (
            <p className="px-3 py-3 text-sm text-muted-foreground">
              No matches for &ldquo;{value}&rdquo;
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
