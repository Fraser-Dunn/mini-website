import MiniCard from "./MiniCard";
import type { Mini, FilterKey, FilterEntry } from "../types/mini";

interface MiniGridProps {
  displayList: Mini[];
  filtersList: FilterEntry[];
}

const MiniGrid = ({ displayList, filtersList }: MiniGridProps) => {
  const sameKeyFilters: Partial<Record<FilterKey, string[]>> = {};
  filtersList.forEach((filter) => {
    if (!sameKeyFilters[filter.key]) {
      sameKeyFilters[filter.key] = [];
    }
    sameKeyFilters[filter.key]!.push(filter.value);
  });

  return (
    <div className="miniGrid-body">
      <div className="miniGrid-grid-container">
        {displayList.map((miniItem) => {
          let isRendered = true;
          (Object.entries(sameKeyFilters) as [FilterKey, string[]][]).forEach(
            ([key, value]) => {
              if (!value.includes(miniItem[key])) {
                isRendered = false;
              }
            }
          );

          return isRendered ? (
            <MiniCard key={miniItem.id} mini={miniItem} />
          ) : null;
        })}
      </div>
    </div>
  );
};

export default MiniGrid;
