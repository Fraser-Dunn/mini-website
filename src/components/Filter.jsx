import React from "react";

const Filter = (props) => {
  const onMutate = (e) => {
    props.addFilter({
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
        </div>
      </div>
    </>
  );
};

export default Filter;
