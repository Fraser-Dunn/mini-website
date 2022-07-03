import MiniSetCard from "./MiniSetCard";

const MiniCardGrid = (props) => {
  const setList = new Set();

  props.displayList.forEach((mini) => {
    const miniValue = mini["set"];
    setList.add(miniValue);
  });

  return (
    <div className="pt-12 pb-24 px-12">
      <div className="grid-container ">
        {[...setList].map((setItem) => {
          const minisOfSet = props.displayList.filter(
            (mini) => mini.set === setItem
          );
          return (
            <MiniSetCard
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

export default MiniCardGrid;

//console.log(props.displayList[1].set);
