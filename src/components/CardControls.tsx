import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { CATEGORIES } from "@/lib/constants/categories";

interface CardControlsProps {
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  onShuffle: () => void;
}

export function CardControls({
  selectedCategory,
  onCategoryChange,
  onShuffle,
}: CardControlsProps) {
  return (
    <Card className="border-0">
      <CardHeader>
        <CardTitle>Card Generation Options</CardTitle>
        <CardDescription>
          Configure your card generation settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="space-y-2 min-w-[200px]">
            <Label htmlFor="category">Category</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between h-10 pr-8"
                >
                  <span className="truncate">{selectedCategory}</span>
                  <ChevronDown className="h-2 w-2 flex-shrink-0 ml-2 sm:h-4 sm:w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px]">
                {CATEGORIES.map((cat) => (
                  <DropdownMenuItem
                    key={cat}
                    onClick={() => onCategoryChange(cat)}
                  >
                    {cat}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button onClick={onShuffle}>Shuffle Cards</Button>
        </div>
      </CardContent>
    </Card>
  );
}
