import { useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { capitalize } from "../utils/capitalize";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Mini, FilterKey, FilterEntry } from "../types/mini";

const sizeOrder = ["Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan"];

interface FilterProps {
  displayList: Mini[];
  filtersList: FilterEntry[];
  addFilter: (filter: FilterEntry) => void;
  removeFilter: (filter: FilterEntry) => void;
}

const Filter = ({ displayList, filtersList, addFilter, removeFilter }: FilterProps) => {
  const { search } = useLocation();
  const allFilters: Record<FilterKey, Set<string>> = {
    set: new Set(),
    size: new Set(),
    race: new Set(),
    type: new Set(),
  };

  const setFilterVar = new URLSearchParams(search);
  const setFilterGet = setFilterVar.get("setFilter");

  displayList.forEach((mini) => {
    (Object.keys(allFilters) as FilterKey[]).forEach((key) => {
      allFilters[key].add(mini[key]);
    });
  });

  const onAddFilter = (key: FilterKey, value: string) => {
    addFilter({ key, value });
  };

  const onRemoveFilter = (key: FilterKey, value: string) => {
    removeFilter({ key, value });
  };

  const filterSort = (
    filtersToBeSorted: Record<FilterKey, Set<string>>
  ): [FilterKey, string[]][] => {
    return (Object.keys(filtersToBeSorted) as FilterKey[]).map((key) => {
      const value = filtersToBeSorted[key];
      const sortedFilters =
        key === "size"
          ? [...value].sort((a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b))
          : [...value].sort();

      return [key, sortedFilters];
    });
  };

  const handleChange = (checked: boolean, key: FilterKey, value: string) => {
    if (checked) {
      onAddFilter(key, value);
    } else {
      onRemoveFilter(key, value);
    }
  };

  const isChecked = (key: FilterKey, value: string) =>
    filtersList.some((filter) => filter.key === key && filter.value === value);

  const clearCategory = (key: FilterKey) => {
    filtersList
      .filter((filter) => filter.key === key)
      .forEach((filter) => onRemoveFilter(filter.key, filter.value));
  };

  useEffect(() => {
    if (setFilterGet) onAddFilter("set", setFilterGet);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setFilterGet]);

  return (
    <div className="container pt-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 font-mono text-xs uppercase tracking-[0.14em] text-primary">
            Filter
          </span>
          {filterSort(allFilters).map(([key, values]) => {
            const activeCount = filtersList.filter((filter) => filter.key === key).length;
            return (
              <Popover key={key}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`gap-1.5 font-mono text-xs uppercase tracking-wide ${
                      activeCount > 0
                        ? "border-primary/50 text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {capitalize(key)}
                    {activeCount > 0 && (
                      <span className="flex h-4 min-w-4 items-center justify-center rounded-sm bg-primary px-1 text-[0.65rem] font-semibold text-primary-foreground">
                        {activeCount}
                      </span>
                    )}
                    <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72">
                  <div className="mb-2.5 flex items-center justify-between border-b border-primary/15 pb-2">
                    <span className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
                      {capitalize(key)}
                    </span>
                    {activeCount > 0 && (
                      <button
                        onClick={() => clearCategory(key)}
                        className="font-mono text-[0.6rem] uppercase tracking-wide text-muted-foreground hover:text-foreground"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="flex max-h-64 flex-wrap gap-1.5 overflow-y-auto pr-1">
                    {values.map((filterItem) => {
                      const active = isChecked(key, filterItem);
                      return (
                        <button
                          key={filterItem}
                          type="button"
                          aria-pressed={active}
                          onClick={() => handleChange(!active, key, filterItem)}
                          className={cn(
                            "rounded-sm border px-2.5 py-1 text-xs transition-colors",
                            active
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-primary/20 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                          )}
                        >
                          {filterItem}
                        </button>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>
            );
          })}
        </div>

        {filtersList.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {filtersList.map((filter) => (
              <button
                key={`${filter.key}-${filter.value}`}
                onClick={() => onRemoveFilter(filter.key, filter.value)}
                className="flex items-center gap-1.5 rounded-sm border border-primary/25 bg-card px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              >
                {filter.value}
                <X className="h-3 w-3" />
              </button>
            ))}
            <button
              onClick={() => filtersList.forEach((filter) => onRemoveFilter(filter.key, filter.value))}
              className="font-mono text-[0.65rem] uppercase tracking-wide text-primary hover:text-primary/80"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Filter;
