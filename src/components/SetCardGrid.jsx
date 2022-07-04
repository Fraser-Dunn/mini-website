import SetCard from "./SetCard";

const SetCardGrid = ({ displayList }) => {
  const setList = new Set();

  displayList.forEach((mini) => {
    const miniValue = mini["set"];
    setList.add(miniValue);
  });

  return (
    <div className="set-card-grid-body">
      <div className="grid-container-SetCardGrid">
        {[...setList].map((setItem) => {
          const minisOfSet = displayList.filter((mini) => mini.set === setItem);
          //console.log(minisOfSet);
          return (
            <SetCard
              key={setItem}
              miniSet={setItem}
              firstOfSetImg={minisOfSet[0].imageUrls[0]}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SetCardGrid;
