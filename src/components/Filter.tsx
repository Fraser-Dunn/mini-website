import { useState, useEffect, type ChangeEvent } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useLocation } from "react-router-dom";
import { capitalize } from "../utils/capitalize";
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
    e: ChangeEvent<HTMLInputElement>,
    key: FilterKey,
    value: string
  ) => {
    if (e.target.checked) {
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
    <>
      <div className="filter-container">
        <div className="filter-body">
          <div className="filter-title-div">
            <h1>Filter</h1>
            <div className="filter-menu-click" onClick={handleClick}>
              {!filterMenu ? (
                <Bars3Icon className="filter-menu-icons" />
              ) : (
                <XMarkIcon className="filter-menu-icons" />
              )}
            </div>
          </div>

          <div className={!filterMenu ? "hidden" : "filter-div"}>
            {filterSort(allFilters).map(([key, value]) => {
              return (
                <div key={key} className="filter-sets-title-div">
                  <div className="filter-sets-title">
                    <h1>{capitalize(key)}s</h1>
                  </div>
                  <div className="filter-sets-div">
                    {value.map((filterItem) => {
                      return (
                        <label
                          key={key + "-" + filterItem}
                          htmlFor={filterItem}
                        >
                          <input
                            type="checkbox"
                            id={filterItem}
                            name={filterItem}
                            defaultChecked={
                              key === "set" && filterItem === setFilterGet
                            }
                            onChange={(e) => handleChange(e, key, filterItem)}
                          />
                          {filterItem}
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Filter;
