import { Images, Swords } from "lucide-react";
import Spinner from "../components/Spinner";
import type { Mini } from "../types/mini";

interface AboutProps {
  data: Mini[];
  loading: boolean;
}

const About = ({ data, loading }: AboutProps) => {
  if (loading) {
    return <Spinner />;
  }

  const stats = [
    { label: "Miniatures", value: data.length },
    { label: "Sets", value: new Set(data.map((mini) => mini.set)).size },
    { label: "Makers", value: new Set(data.map((mini) => mini.maker)).size },
    { label: "Brands", value: new Set(data.map((mini) => mini.brand)).size },
  ];

  return (
    <>
      <div className="border-b border-primary/15">
        <div className="container max-w-3xl py-16">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">About</p>
          <h1 className="mt-3 text-balance font-display text-4xl font-bold uppercase leading-[1.02] tracking-wide">
            Welcome to my miniature collection
          </h1>
          <div className="mt-4 max-w-xl space-y-3 text-muted-foreground">
            <p>
              I have created this website to assist in keeping track of my growing mini
              collection.
            </p>
            <p>
              The goal for this website was to blend the aspects of both an image gallery
              and a referencing tool for table-top gaming.
            </p>
          </div>
        </div>
      </div>

      <div className="container max-w-3xl py-12">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-primary/15 bg-primary/15 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card px-4 py-5 text-center">
              <span className="block font-display text-3xl font-bold tabular-nums text-primary">
                {stat.value}
              </span>
              <span className="mt-1 block font-mono text-[0.6rem] uppercase tracking-[0.1em] text-muted-foreground">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-sm border border-primary/15 bg-card p-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-primary/30 text-primary">
              <Images className="h-4 w-4" />
            </div>
            <h2 className="mt-4 font-display text-lg font-bold uppercase tracking-wide">
              Gallery
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Information about the physical miniature itself.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {["Brand", "Image", "Maker", "Set"].map((field) => (
                <span
                  key={field}
                  className="rounded-sm border border-primary/20 px-2 py-1 text-xs text-muted-foreground"
                >
                  {field}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-sm border border-primary/15 bg-card p-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-primary/30 text-primary">
              <Swords className="h-4 w-4" />
            </div>
            <h2 className="mt-4 font-display text-lg font-bold uppercase tracking-wide">
              Table-top
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Information about the table-top ruleset.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {["Race", "Size", "Statblock", "Type"].map((field) => (
                <span
                  key={field}
                  className="rounded-sm border border-primary/20 px-2 py-1 text-xs text-muted-foreground"
                >
                  {field}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
