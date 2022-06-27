import React from "react";

const Filter = (props) => {
  const onMutate = (e) => {
    props.addFilter({
      key: "set",
      value: "Legends of Barovia",
    });
  };

  const onMutate2 = (e) => {
    props.removeFilter({
      key: "set",
      value: "Legends of Barovia",
    });
  };

  return (
    <>
      <div className="filter-container">
        <div className="filter-body">
          <h1>FILTER</h1>
          <button onClick={onMutate} className="filter-button">
            LoB
          </button>
          <button onClick={onMutate2} className="filter-button">
            remove Lob
          </button>
        </div>
      </div>
    </>
  );
};

export default Filter;
