import { useState } from "react";
import MiniGrid from "../components/MiniGrid";
import Filter from "../components/Filter";
import type { Mini, FilterEntry } from "../types/mini";

interface GalleryProps {
  data: Mini[];
}

const Gallery = ({ data }: GalleryProps) => {
  const [filtersList, setFiltersList] = useState<FilterEntry[]>([]);

  const addFilter = (newFilter: FilterEntry) => {
    setFiltersList((prevState) => [...prevState, newFilter]);
  };

  const removeFilter = (filterToBeRemoved: FilterEntry) => {
    setFiltersList((prevState) =>
      prevState.filter(
        (filter) =>
          filter.key !== filterToBeRemoved.key ||
          filter.value !== filterToBeRemoved.value
      )
    );
  };

  return (
    <>
      <Filter displayList={data} addFilter={addFilter} removeFilter={removeFilter} />
      <MiniGrid displayList={data} filtersList={filtersList} />
    </>
  );
};

export default Gallery;
