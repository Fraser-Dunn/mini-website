import React, { useState } from "react";
import getMinis from "../helperFunctions/firebaseGetAllMinis";
import Spinner from "../components/Spinner";

const Search = () => {
  const [minis, setMinis] = useState(null);
  const [loading, setLoading] = useState(true);

  // const fetchMinis = async () => {
  //   const data = await getMinis();
  //   setMinis(data);
  //   setLoading(false);
  // };
  // setTimeout(() => {
  //   console.log("exited timeout");
  // }, 5000);
  // fetchMinis();

  //   if (loading) {
  //     return <Spinner />;
  //   }

  return <div>Search</div>;
};

export default Search;
