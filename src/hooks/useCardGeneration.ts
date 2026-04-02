import { useState, useEffect } from "react";
import { tabooList } from "../lib/data/tabooList";
import {
  generateSVG,
  generateMultipleSVGs,
} from "../lib/renderers/cardRenderer";
import type { TabooCard } from "../types/taboo";

interface UseCardGenerationProps {
  selectedCategory: string;
}

export function useCardGeneration({
  selectedCategory,
}: UseCardGenerationProps) {
  const [output, setOutput] = useState<string>("");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [generatedCards, setGeneratedCards] = useState<string[]>([]);

  // Filter cards by category
  const filteredCards = tabooList.filter(
    (card) => card.category === selectedCategory,
  );

  // Generate cards when category changes or on initial load
  useEffect(() => {
    const generateCards = async () => {
      if (filteredCards.length > 0) {
        // Always generate all cards in the category for carousel mode
        const pairs = [];
        // Use filteredCards as-is to maintain order
        for (let i = 0; i < filteredCards.length - 1; i += 2) {
          pairs.push({
            id: `${selectedCategory}-${Date.now()}-${i}`,
            top: filteredCards[i],
            bottom: filteredCards[i + 1],
            createdAt: new Date(),
          });
        }

        if (pairs.length > 0) {
          const svgs = await generateMultipleSVGs(pairs, {
            category: selectedCategory,
          });
          setGeneratedCards(svgs);
          setOutput(svgs[0]);
          setCurrentCardIndex(0);
        }
      }
    };

    generateCards();
  }, [selectedCategory]);

  // Shuffle cards in the current category
  const shuffleCards = async () => {
    const shuffled = [...filteredCards].sort(() => Math.random() - 0.5);

    // Always generate all possible pairs for carousel from shuffled cards
    const pairs = [];
    for (let i = 0; i < shuffled.length - 1; i += 2) {
      pairs.push({
        id: `shuffle-${Date.now()}-${i}`,
        top: shuffled[i],
        bottom: shuffled[i + 1],
        createdAt: new Date(),
      });
    }

    if (pairs.length > 0) {
      const svgs = await generateMultipleSVGs(pairs, {
        category: selectedCategory,
      });
      setGeneratedCards(svgs);
      setOutput(svgs[0]);
      setCurrentCardIndex(0);
    }
  };

  // Generate custom card
  const generateCustomCard = async (topWord: string, bottomWord: string) => {
    if (!topWord.trim() || !bottomWord.trim()) return;

    const card: TabooCard = {
      id: `custom-${Date.now()}`,
      top: {
        index: -1,
        word: topWord.trim(),
        taboo: bottomWord
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
        explanation: "",
        category: selectedCategory,
      },
      bottom: {
        index: -1,
        word: bottomWord.trim(),
        taboo: [],
        explanation: "",
        category: selectedCategory,
      },
      createdAt: new Date(),
    };

    const svg = await generateSVG(card, {
      category: selectedCategory,
    });

    setOutput(svg);
    setCurrentCardIndex(0);
    setGeneratedCards([]);
  };

  // Carousel navigation
  const navigateCarousel = (direction: "prev" | "next") => {
    if (generatedCards.length === 0) return;

    if (direction === "prev") {
      setCurrentCardIndex(
        (prev) => (prev - 1 + generatedCards.length) % generatedCards.length,
      );
    } else {
      setCurrentCardIndex((prev) => (prev + 1) % generatedCards.length);
    }
  };

  // Update displayed card when index changes
  useEffect(() => {
    if (generatedCards.length > 0) {
      setOutput(generatedCards[currentCardIndex]);
    }
  }, [currentCardIndex, generatedCards]);

  // Export functions
  const exportSVG = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "taboo-cards.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPNG = async () => {
    if (!output) return;

    // Create canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 300 DPI for print quality: 610x910 SVG * (300/96)
    canvas.width = 1906;
    canvas.height = 2844;

    // Create image from SVG
    const img = new Image();
    const svg = new Blob([output], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svg);

    img.onload = () => {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          const pngUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = pngUrl;
          a.download = "taboo-cards.png";
          a.click();
          URL.revokeObjectURL(pngUrl);
        }
      }, "image/png");

      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      console.error("Failed to load SVG for PNG export");
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  return {
    output,
    currentCardIndex,
    generatedCards,
    filteredCards,
    shuffleCards,
    generateCustomCard,
    navigateCarousel,
    exportSVG,
    exportPNG,
  };
}
