import MiniCard from "./MiniCard";
import strahd from "../assets/strahd.json";

const MiniGrid = (props) => {
  return (
    <div className="py-24 px-12">
      <div className="grid-container ">
        {props.displayList.map((miniItem) => {
          let isRendered = true;
          props.filtersList.forEach((filter) => {
            if (miniItem[filter.key] !== filter.value) {
              isRendered = false;
            }
          });
          return isRendered ? (
            <MiniCard key={miniItem.id} mini={miniItem} />
          ) : null;
        })}
      </div>
    </div>
  );
};

export default MiniGrid;
