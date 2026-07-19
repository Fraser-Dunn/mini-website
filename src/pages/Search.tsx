import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Spinner from "../components/Spinner";
import MiniGrid from "../components/MiniGrid";
import NoResults from "../components/NoResults";
import type { Mini } from "../types/mini";

interface SearchProps {
  data: Mini[];
  loading: boolean;
}

const Search = ({ data, loading }: SearchProps) => {
  const [displayList, setDisplayList] = useState<Mini[]>([]);
  const { search } = useLocation();
  const searchTerm = new URLSearchParams(search).get("term") ?? "";

  useEffect(() => {
    setDisplayList(
      data.filter((mini) => {
        return mini.name.toUpperCase().includes(searchTerm.toUpperCase());
      })
    );
  }, [data, searchTerm]);

  if (loading) {
    return <Spinner />;
  }

  if (displayList.length < 1) {
    return <NoResults />;
  }

  return (
    <>
      <div className="border-b border-primary/15">
        <div className="container max-w-3xl py-12">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
            Search results
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold uppercase leading-tight tracking-wide sm:text-4xl">
            &ldquo;{searchTerm}&rdquo;
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {displayList.length} {displayList.length === 1 ? "match" : "matches"}
          </p>
        </div>
      </div>
      <MiniGrid filtersList={[]} displayList={displayList} />
    </>
  );
};

export default Search;
