import MiniCard from "./MiniCard";
import strahd from "../assets/strahd.json";

const MiniGrid = () => {
  const displayList = [strahd, strahd, strahd, strahd, strahd, strahd];

  return (
    <div className="py-24 px-12">
      <div className="grid-container">
        {displayList.map((miniItem) => (
          <MiniCard mini={miniItem} />
        ))}
      </div>
    </div>
  );
};

export default MiniGrid;
