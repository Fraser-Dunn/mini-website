import React from "react";

const Filter = (props) => {
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
        <div className="filter-body">
          <h1>FILTER</h1>
          <label htmlFor="LoB">
            <input
              type="checkbox"
              id="LoB"
              name="LoB"
              onChange={(e) => handleChange(e, "set", "Legends of Barovia")}
            />
            LoB
          </label>
        </div>
      </div>
    </>
  );
};

export default Filter;
