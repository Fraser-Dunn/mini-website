import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
        Welcome To My Miniature Collection Website
      </h1>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-2xl">Hey There!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>
            I have created this website to assist in keeping track of my
            growing mini collection.
          </p>
          <p>
            The goal for this website was to blend the aspects of both an
            image gallery and a referencing tool for table-top gaming.
          </p>
        </CardContent>
      </Card>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Gallery</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p className="mb-2">
              The gallery aspect refers to information about the physical
              miniature and highlights:
            </p>
            <ul className="list-inside list-disc space-y-1">
              <li>Brand</li>
              <li>Image</li>
              <li>Maker</li>
              <li>Set</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Table-top</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p className="mb-2">
              The table-top aspect refers to information about the table-top
              ruleset and highlights:
            </p>
            <ul className="list-inside list-disc space-y-1">
              <li>Race</li>
              <li>Size</li>
              <li>Statblock</li>
              <li>Type</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
