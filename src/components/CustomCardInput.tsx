import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface CustomCardInputProps {
  customCard: { top: string; bottom: string };
  onCustomCardChange: (card: { top: string; bottom: string }) => void;
  onGenerateCustom: () => void;
}

export function CustomCardInput({
  customCard,
  onCustomCardChange,
  onGenerateCustom,
}: CustomCardInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer p-4 sm:p-6">
            <CardTitle className="flex items-center justify-between text-lg sm:text-2xl">
              Custom Card
              <ChevronDown
                className={`h-2 w-2 sm:h-4 sm:w-4 transition-transform ${
                  isOpen ? "transform rotate-180" : ""
                }`}
              />
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Create a custom card by entering words and taboo words
              (comma-separated)
            </CardDescription>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="top-word">Top Word</Label>
                <Textarea
                  id="top-word"
                  placeholder="React"
                  value={customCard.top}
                  onChange={(e) =>
                    onCustomCardChange({ ...customCard, top: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bottom-word">Bottom Word</Label>
                <Textarea
                  id="bottom-word"
                  placeholder="State, useState, Redux, Props, Components"
                  value={customCard.bottom}
                  onChange={(e) =>
                    onCustomCardChange({
                      ...customCard,
                      bottom: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <Button onClick={onGenerateCustom} className="w-full">
              Generate Custom Card
            </Button>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
