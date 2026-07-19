const About = () => {
  return (
    <div className="container max-w-3xl py-16">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">About</p>
      <h1 className="mt-3 text-balance font-display text-4xl font-bold uppercase leading-[1.02] tracking-wide">
        Welcome to my miniature collection
      </h1>

      <div className="mt-6 space-y-3 text-muted-foreground">
        <p>
          I have created this website to assist in keeping track of my growing mini
          collection.
        </p>
        <p>
          The goal for this website was to blend the aspects of both an image gallery and
          a referencing tool for table-top gaming.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-sm border border-primary/15 bg-card p-6">
          <h2 className="font-display text-lg font-bold uppercase tracking-wide">Gallery</h2>
          <p className="mt-2 mb-2 text-sm text-muted-foreground">
            The gallery aspect refers to information about the physical miniature and
            highlights:
          </p>
          <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>Brand</li>
            <li>Image</li>
            <li>Maker</li>
            <li>Set</li>
          </ul>
        </div>

        <div className="rounded-sm border border-primary/15 bg-card p-6">
          <h2 className="font-display text-lg font-bold uppercase tracking-wide">
            Table-top
          </h2>
          <p className="mt-2 mb-2 text-sm text-muted-foreground">
            The table-top aspect refers to information about the table-top ruleset and
            highlights:
          </p>
          <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>Race</li>
            <li>Size</li>
            <li>Statblock</li>
            <li>Type</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
