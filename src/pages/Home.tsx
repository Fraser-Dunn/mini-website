import SetCardGrid from "../components/SetCardGrid";
import type { Mini } from "../types/mini";

interface HomeProps {
  data: Mini[];
}

const Home = ({ data }: HomeProps) => {
  return <SetCardGrid displayList={data} />;
};

export default Home;
