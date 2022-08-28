import React, { useState } from "react";
import MiniGrid from "../components/MiniGrid";
import Filter from "../components/Filter";

const Gallery = ({ data }) => {
  const [filtersList, setFiltersList] = useState([]);

  const addFilter = (newFilter) => {
    const updatedFilteredList = filtersList.slice(0);
    updatedFilteredList.push(newFilter);
    setFiltersList(updatedFilteredList);
  };

  const removeFilter = (filterToBeRemoved) => {
    const updatedFilteredList = filtersList.filter((filter) => {
      return (
        filter.key !== filterToBeRemoved.key ||
        filter.value !== filterToBeRemoved.value
      );
    });
    setFiltersList(updatedFilteredList);
  };

  return (
    <>
      <div>
        <Filter
          displayList={data}
          addFilter={addFilter}
          removeFilter={removeFilter}
        />
        <MiniGrid displayList={data} filtersList={filtersList} />
      </div>
    </>
  );
};

export default Gallery;
