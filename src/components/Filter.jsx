import React, { useState, useEffect } from "react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { useLocation } from "react-router-dom";

Object.defineProperty(String.prototype, "capitalize", {
  value: function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false,
});

const sizeOrder = ["Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan"];

const Filter = ({ displayList, addFilter, removeFilter }) => {
  const [filterMenu, setFilterMenu] = useState(false);
  const handleClick = () => setFilterMenu(!filterMenu);
  const { search } = useLocation();
  const allFilters = {
    set: new Set(),
    size: new Set(),
    race: new Set(),
    type: new Set(),
  };

  const setFilterVar = new URLSearchParams(search, [search]);
  const setFilterGet = setFilterVar.get("setFilter");

  displayList.forEach((mini) => {
    Object.entries(allFilters).forEach(([key, value]) => {
      const miniValue = mini[key];
      value.add(miniValue);
    });
  });

  const onAddFilter = (key, value) => {
    addFilter({
      key: key,
      value: value,
    });
  };

  const filterSort = (filtersToBeSorted) => {
    const allSortedFilters = [];
    Object.entries(filtersToBeSorted).forEach(([key, value]) => {
      let sortedFilters;
      if (key === "size") {
        sortedFilters = [...value].sort(
          (a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b)
        );
      } else {
        sortedFilters = [...value].sort();
      }

      allSortedFilters.push([key, sortedFilters]);
    });
    return allSortedFilters;
  };

  const onRemoveFilter = (key, value) => {
    removeFilter({
      key: key,
      value: value,
    });
  };

  const handleChange = (e, key, value) => {
    if (e.target.checked) {
      onAddFilter(key, value);
    } else {
      onRemoveFilter(key, value);
    }
  };

  useEffect(() => {
    if (setFilterGet) onAddFilter("set", setFilterGet);
  }, [setFilterGet]);

  return (
    <>
      <div className="filter-container">
        <div className="filter-body">
          <div className="filter-title-div">
            <h1>Filter</h1>
            <div className="filter-menu-click" onClick={handleClick}>
              {!filterMenu ? (
                <MenuIcon className="filter-menu-icons" />
              ) : (
                <XIcon className="filter-menu-icons" />
              )}
            </div>
          </div>

          <div className={!filterMenu ? "hidden" : "filter-div"}>
            {filterSort(allFilters).map(([key, value]) => {
              return (
                <div key={key} className="filter-sets-title-div">
                  <div className="filter-sets-title">
                    <h1>{key.capitalize()}s</h1>
                  </div>
                  <div className="filter-sets-div">
                    {[...value].map((filterItem) => {
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
                                ? true
                                : false
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
