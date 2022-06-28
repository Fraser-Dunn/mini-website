import React, { useState } from "react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";

Object.defineProperty(String.prototype, "capitalize", {
  value: function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false,
});

const Filter = (props) => {
  const [filterMenu, setFilterMenu] = useState(false);
  const handleClick = () => setFilterMenu(!filterMenu);

  const allFilters = {
    set: new Set(),
    size: new Set(),
    race: new Set(),
    type: new Set(),
  };

  props.displayList.forEach((mini) => {
    Object.entries(allFilters).forEach(([key, value]) => {
      const miniValue = mini[key];
      value.add(miniValue);
    });
  });

  console.log(allFilters);

  const onAddFilter = (key, value) => {
    props.addFilter({
      key: key,
      value: value,
    });
  };

  const onRemoveFilter = (key, value) => {
    props.removeFilter({
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

  return (
    <>
      <div className="filter-container">
        <div className="filter-body shadow-md">
          <div className="filter-title-div">
            <h1>Filter</h1>
            <div className="filter-menu-click" onClick={handleClick}>
              {!filterMenu ? (
                <MenuIcon className="w-5 text-black" />
              ) : (
                <XIcon className="w-5 text-black" />
              )}
            </div>
          </div>

          <div className={!filterMenu ? "hidden" : "filter-div"}>
            {Object.entries(allFilters).map(([key, value]) => {
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
