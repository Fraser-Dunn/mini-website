import React from "react";

const Filter = (props) => {
  const onMutate = (e) => {
    console.log(
      props.displayList.filter(
        (displayList) => displayList.set === "Legends of Barovia"
      )
    );
  };

  return (
    <>
      <div className="filter-container">
        <div className="filter-body">
          <h1>FILTER</h1>
          <button onClick={onMutate} className="bg-black">
            DotMM
          </button>
        </div>
      </div>
    </>
  );
};

export default Filter;
