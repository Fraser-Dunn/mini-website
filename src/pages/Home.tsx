import SetCardGrid from "../components/SetCardGrid";
import type { Mini } from "../types/mini";

interface HomeProps {
  data: Mini[];
}

const Home = ({ data }: HomeProps) => {
  return (
    <>
      <div>
        <SetCardGrid displayList={data} />
      </div>
    </>
  );
};

export default Home;
