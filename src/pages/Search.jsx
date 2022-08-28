import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Spinner from "../components/Spinner";
import MiniGrid from "../components/MiniGrid";

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

  return (
    <div>
      <MiniGrid filtersList={[]} displayList={displayList} />
    </div>
  );
};

export default Search;
