import MiniCard from "./MiniCard";
import strahd from "../assets/strahd.json";

const MiniGrid = (props) => {
  return (
    <div className="py-24 px-12">
      <div className="grid-container ">
        {props.displayList.map((miniItem) => (
          <MiniCard key={miniItem.id} mini={miniItem} />
        ))}
      </div>
    </div>
  );
};

export default MiniGrid;
