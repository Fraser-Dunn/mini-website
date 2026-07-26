import { useState } from "react";
import MiniGrid from "../components/MiniGrid";
import Filter from "../components/Filter";
import Spinner from "../components/Spinner";
import type { Mini, FilterEntry } from "../types/mini";

interface GalleryProps {
  data: Mini[];
  loading: boolean;
}

const Gallery = ({ data, loading }: GalleryProps) => {
  const [filtersList, setFiltersList] = useState<FilterEntry[]>([]);

  if (loading) {
    return <Spinner />;
  }

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
      <div className="border-b border-primary/15">
        <div className="container max-w-3xl py-12">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
            The gallery
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold uppercase leading-tight tracking-wide sm:text-4xl">
            All miniatures
          </h1>
        </div>
      </div>
      <Filter
        displayList={data}
        filtersList={filtersList}
        addFilter={addFilter}
        removeFilter={removeFilter}
      />
      <MiniGrid displayList={data} filtersList={filtersList} />
    </>
  );
};

export default Gallery;
