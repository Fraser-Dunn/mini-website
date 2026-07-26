import SetCardGrid from "../components/SetCardGrid";
import Spinner from "../components/Spinner";
import type { Mini } from "../types/mini";

interface HomeProps {
  data: Mini[];
  loading: boolean;
}

const Home = ({ data, loading }: HomeProps) => {
  const setCount = new Set(data.map((mini) => mini.set)).size;

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="border-b border-primary/15">
        <div className="container max-w-3xl py-16">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
            Personal archive · {data.length} miniatures
          </p>
          <h1 className="mt-3 text-balance font-display text-4xl font-bold uppercase leading-[1.02] tracking-wide sm:text-5xl">
            Every miniature, catalogued
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            A growing Dungeons &amp; Dragons collection, sorted into {setCount} sets and
            documented as both an image gallery and a reference for the table.
          </p>
        </div>
      </div>
      <SetCardGrid displayList={data} />
    </>
  );
};

export default Home;
