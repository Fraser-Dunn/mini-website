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

  return <MiniGrid filtersList={[]} displayList={displayList} />;
};

export default Search;
