import { Link } from "react-router-dom";
import MiniCard from "../components/MiniCard";
import strahd from "../assets/strahd.json";

const Home = () => {
  return (
    <>
      <div>
        <MiniCard mini={strahd} />
      </div>
    </>
  );
};

export default Home;
