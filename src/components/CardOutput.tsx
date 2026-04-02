import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CardOutputProps {
  output: string;
  currentCardIndex: number;
  generatedCards: string[];
  onExportSVG: () => void;
  onExportPNG: () => void;
  onNavigateCarousel: (direction: "prev" | "next") => void;
}

export function CardOutput({
  output,
  currentCardIndex,
  generatedCards,
  onExportSVG,
  onExportPNG,
  onNavigateCarousel,
}: CardOutputProps) {
  return (
    <Card>
      <CardContent className="space-y-4">
        <div
          className="rounded-lg p-4 bg-white overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: output }}
        />
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full sm:w-auto">Export</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={onExportPNG}>
                Export as PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExportSVG}>
                Export as SVG
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex items-center gap-2 sm:ml-auto">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onNavigateCarousel("prev")}
              disabled={generatedCards.length <= 1}
              className="h-10 w-10 p-0"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <span className="text-sm text-muted-foreground min-w-[80px] text-center">
              {currentCardIndex + 1} / {generatedCards.length}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onNavigateCarousel("next")}
              disabled={generatedCards.length <= 1}
              className="h-10 w-10 p-0"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
