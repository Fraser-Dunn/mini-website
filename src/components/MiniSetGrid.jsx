import React from "react";

const MiniSetGrid = ({ displayList }) => {
  const minisToBeShown = new Set();

  displayList.forEach((mini) => {
    if (mini.set === "Van Richten's Guide to Ravenloft") {
      minisToBeShown.add(mini);
    }
  });

  //console.log(minisToBeShown);

  return (
    <div className="pt-12 pb-24 px-12">
      <div className="grid-container ">Hey</div>
    </div>
  );
};

export default MiniSetGrid;

//   displayList.map((miniItem) => {
//     console.log(miniItem.name);
//   });
