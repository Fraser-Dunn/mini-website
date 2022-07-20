import MiniCard from "./MiniCard";

const MiniGrid = ({ displayList, filtersList }) => {
  const sameKeyFilters = {};
  filtersList.forEach((filter) => {
    if (!sameKeyFilters[filter.key]) {
      sameKeyFilters[filter.key] = [];
    }
    sameKeyFilters[filter.key].push(filter.value);
  });

  return (
    <div className="miniGrid-body">
      <div className="miniGrid-grid-container">
        {displayList.map((miniItem) => {
          let isRendered = true;
          Object.entries(sameKeyFilters).forEach(([key, value]) => {
            if (!value.includes(miniItem[key])) {
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
