import MiniSetCard from "./MiniSetCard";

const MiniCardGrid = (props) => {
  const setList = new Set();

  props.displayList.forEach((mini) => {
    const miniValue = mini["set"];
    setList.add(miniValue);
  });

  console.log(setList);

  return (
    <div className="pt-12 pb-24 px-12">
      <div className="grid-container ">
        {[...setList].map((setItem) => {
          return <MiniSetCard key={setItem} mini={setItem} />;
        })}
      </div>
    </div>
  );
};

export default MiniCardGrid;

//console.log(props.displayList[1].set);
