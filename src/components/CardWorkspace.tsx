import { CardControls } from "./CardControls";
import { CardOutput } from "./CardOutput";
import { CustomCardInput } from "./CustomCardInput";

interface CardWorkspaceProps {
  selectedCategory: string;
  customCard: { top: string; bottom: string };
  output: string;
  currentCardIndex: number;
  generatedCards: string[];
  onCategoryChange: (value: string) => void;
  onShuffle: () => void;
  onCustomCardChange: (card: { top: string; bottom: string }) => void;
  onGenerateCustom: () => void;
  onExportSVG: () => void;
  onExportPNG: () => void;
  onNavigateCarousel: (direction: "prev" | "next") => void;
}

export function CardWorkspace({
  selectedCategory,
  customCard,
  output,
  currentCardIndex,
  generatedCards,
  onCategoryChange,
  onShuffle,
  onCustomCardChange,
  onGenerateCustom,
  onExportSVG,
  onExportPNG,
  onNavigateCarousel,
}: CardWorkspaceProps) {
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8">
      {/* On mobile: Show card output first */}
      {output && (
        <div className="lg:col-span-2 order-1 lg:order-none">
          <CardOutput
            output={output}
            currentCardIndex={currentCardIndex}
            generatedCards={generatedCards}
            onExportSVG={onExportSVG}
            onExportPNG={onExportPNG}
            onNavigateCarousel={onNavigateCarousel}
          />
        </div>
      )}

      {/* On mobile: Show controls second */}
      <div className="lg:col-span-1 order-2 lg:order-none space-y-4">
        <CardControls
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          onShuffle={onShuffle}
        />
        <CustomCardInput
          customCard={customCard}
          onCustomCardChange={onCustomCardChange}
          onGenerateCustom={onGenerateCustom}
        />
      </div>
    </div>
  );
}
