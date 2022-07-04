import React from "react";
import { useState, useEffect } from "react";
import MiniSetGrid from "../components/MiniSetGrid";
import getMinis from "../helperFunctions/firebaseGetAllMinis";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";

const Sets = () => {
  const [miniList, setMiniList] = useState(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const currentSet = params.miniSet;

  console.log(currentSet);

  const fetchMinis = async () => {
    //console.log(params.miniId);
    const fetchRequest = await getMinis();

    if (fetchRequest) {
      console.log(fetchRequest);
      setMiniList(fetchRequest);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMinis();
  }, [params.miniSet]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <div>
        <MiniSetGrid displayList={miniList} />
      </div>
    </>
  );
};

export default Sets;
