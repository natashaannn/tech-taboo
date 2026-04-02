import { Navigation } from "../components/Navigation";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

function Manufacturer() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container">
        <div className="py-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Manufacturer Downloads
          </h1>
          <p className="text-muted-foreground">
            High-quality assets for print manufacturing.
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Card Sets</CardTitle>
                <CardDescription>
                  Download complete card sets in various formats
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full">Download PNG ZIP</Button>
                <Button variant="outline" className="w-full">
                  Download SVG ZIP
                </Button>
                <Button variant="secondary" className="w-full">
                  Download PDF ZIP
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Packaging Designs</CardTitle>
                <CardDescription>
                  Professional packaging templates and layouts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full">Download Whole ZIP</Button>
                <Button variant="outline" className="w-full">
                  Download Panels ZIP
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reference Materials</CardTitle>
                <CardDescription>
                  Style guides and reference documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Download Style Guide
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Reference Preview</CardTitle>
              <CardDescription>
                Example card design for reference
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <img
                  src="/card.png"
                  alt="Reference card preview"
                  className="max-w-sm rounded-lg border border-border"
                  onError={(e) => {
                    e.currentTarget.src = "/favicon.svg";
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default Manufacturer;
