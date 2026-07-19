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
    <div className="container py-10">
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
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
