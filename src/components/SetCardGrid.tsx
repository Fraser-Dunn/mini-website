import SetCard from "./SetCard";
import type { Mini } from "../types/mini";

interface SetCardGridProps {
  displayList: Mini[];
}

const SetCardGrid = ({ displayList }: SetCardGridProps) => {
  const setList = new Set<string>();

  displayList.forEach((mini) => {
    setList.add(mini.set);
  });

  return (
    <div className="set-card-grid-body">
      <div className="grid-container-SetCardGrid">
        {[...setList].map((setItem) => {
          const minisOfSet = displayList.filter((mini) => mini.set === setItem);
          return (
            <SetCard
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

export default SetCardGrid;
