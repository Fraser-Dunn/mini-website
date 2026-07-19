import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { capitalize } from "../utils/capitalize";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { Mini, FilterKey, FilterEntry } from "../types/mini";

const sizeOrder = ["Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan"];

interface FilterProps {
  displayList: Mini[];
  addFilter: (filter: FilterEntry) => void;
  removeFilter: (filter: FilterEntry) => void;
}

const Filter = ({ displayList, addFilter, removeFilter }: FilterProps) => {
  const [filterMenu, setFilterMenu] = useState(false);
  const handleClick = () => setFilterMenu(!filterMenu);
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

  const handleChange = (
    checked: boolean,
    key: FilterKey,
    value: string
  ) => {
    if (checked) {
      onAddFilter(key, value);
    } else {
      onRemoveFilter(key, value);
    }
  };

  useEffect(() => {
    if (setFilterGet) onAddFilter("set", setFilterGet);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setFilterGet]);

  return (
    <div className="container pt-6">
      <div className="mx-auto max-w-5xl rounded-lg border bg-card">
        <div className="flex items-center justify-between border-b p-4">
          <h1 className="text-lg font-semibold">Filter</h1>
          <Button variant="ghost" size="icon" onClick={handleClick} aria-label="Toggle filters">
            {!filterMenu ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </Button>
        </div>

        <div className={!filterMenu ? "hidden" : "grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 lg:grid-cols-4"}>
          {filterSort(allFilters).map(([key, value]) => {
            return (
              <div key={key}>
                <div className="mb-2 rounded-md bg-primary px-2 py-1">
                  <h2 className="text-sm font-semibold text-primary-foreground">
                    {capitalize(key)}s
                  </h2>
                </div>
                <div className="grid max-h-48 grid-cols-2 gap-2 overflow-y-auto">
                  {value.map((filterItem) => {
                    const inputId = `${key}-${filterItem}`;
                    return (
                      <div key={inputId} className="flex items-center gap-2">
                        <Checkbox
                          id={inputId}
                          defaultChecked={key === "set" && filterItem === setFilterGet}
                          onCheckedChange={(checked) =>
                            handleChange(checked === true, key, filterItem)
                          }
                        />
                        <Label htmlFor={inputId} className="cursor-pointer text-sm font-normal">
                          {filterItem}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Filter;
