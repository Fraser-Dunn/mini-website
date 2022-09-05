import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Spinner from "../components/Spinner";
import MiniGrid from "../components/MiniGrid";
import NoResults from "../components/NoResults";

const Search = ({ data, loading }) => {
  const [displayList, setDisplayList] = useState([]);
  const { search } = useLocation();
  const searchObject = new URLSearchParams(search, [search]);
  const searchTerm = searchObject.get("term");

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
    <div>
      <MiniGrid filtersList={[]} displayList={displayList} />
    </div>
  );
};

export default Search;
