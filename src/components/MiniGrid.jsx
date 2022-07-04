import MiniCard from "./MiniCard";

const MiniGrid = ({ displayList, filtersList }) => {
  return (
    <div className="pt-12 pb-24 px-12">
      <div className="grid-container ">
        {displayList.map((miniItem) => {
          let isRendered = true;
          filtersList.forEach((filter) => {
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
