import React from "react";
import SetCardGrid from "../components/SetCardGrid";

const Home = ({ data }) => {
  return (
    <>
      <div>
        <SetCardGrid displayList={data} />
      </div>
    </>
  );
};

export default Home;
