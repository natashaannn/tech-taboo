import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { CardWorkspace } from "@/components/CardWorkspace";
import { useCardGeneration } from "../hooks/useCardGeneration";

export function CardGenerator() {
  const [selectedCategory, setSelectedCategory] = useState<string>("General");
  const [customCard, setCustomCard] = useState({ top: "", bottom: "" });

  const {
    output,
    currentCardIndex,
    generatedCards,
    shuffleCards,
    generateCustomCard,
    navigateCarousel,
    exportSVG,
    exportPNG,
  } = useCardGeneration({ selectedCategory });

  const handleGenerateCustomCard = () => {
    generateCustomCard(customCard.top, customCard.bottom);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Techie Taboo Card Generator
            </h1>
            <p className="text-muted-foreground">
              Generate custom taboo cards for tech learning and team building
            </p>
          </div>

          {/* Card Workspace */}
          <CardWorkspace
            selectedCategory={selectedCategory}
            customCard={customCard}
            output={output}
            currentCardIndex={currentCardIndex}
            generatedCards={generatedCards}
            onCategoryChange={setSelectedCategory}
            onShuffle={shuffleCards}
            onCustomCardChange={setCustomCard}
            onGenerateCustom={handleGenerateCustomCard}
            onExportSVG={exportSVG}
            onExportPNG={exportPNG}
            onNavigateCarousel={navigateCarousel}
          />
        </div>
      </main>
    </div>
  );
}
