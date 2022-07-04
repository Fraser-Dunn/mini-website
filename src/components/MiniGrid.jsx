import MiniCard from "./MiniCard";

const MiniGrid = ({ displayList, filtersList }) => {
  return (
    <div className="miniGrid-body">
      <div className="miniGrid-grid-container">
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
