import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container">
        <h1>
          <object type="image/svg+xml" data="./favicon.svg">
            Your browser does not support SVG
          </object>
          Techie Taboo Card Generator
        </h1>
        <p>
          Made with 💜 by{" "}
          <a
            href="https://linktr.ee/ragtechdev"
            target="_blank"
            rel="noopener noreferrer"
          >
            ragTech
          </a>
          , a real life in tech podcast
        </p>

        <div className="space-x-4">
          <Button>Generate Cards</Button>
          <Button variant="outline">Save as SVG</Button>
          <Button variant="secondary">Save as PNG</Button>
        </div>

        <div
          id="legend"
          style={{
            margin: "16px 0",
            padding: "12px",
            background: "white",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        >
          {/* Your existing legend content will go here */}
        </div>
      </main>
    </div>
  );
}

export default App;
