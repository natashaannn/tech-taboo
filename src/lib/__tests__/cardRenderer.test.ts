import { describe, it, expect } from "vitest";
import { generateSVG } from "../renderers/cardRenderer";
import type { TabooCard } from "../../types/taboo";

describe("generateSVG", () => {
  const mockCard: TabooCard = {
    id: "test-card-1",
    top: {
      index: 1,
      word: "React",
      taboo: ["JavaScript", "Library", "Facebook", "Components", "Virtual DOM"],
      explanation: "A JavaScript library",
      category: "Frontend",
    },
    bottom: {
      index: 2,
      word: "State",
      taboo: ["Data", "Component", "Immutable", "Mutable", "Store"],
      explanation: "Component state",
      category: "Frontend",
    },
    createdAt: new Date(),
  };

  it("should generate valid SVG with card data", async () => {
    const svg = await generateSVG(mockCard);

    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
    expect(svg).toContain("React");
    expect(svg).toContain("State");
    expect(svg).toContain("JavaScript");
    expect(svg).toContain("Data");
  });

  it("should include custom options when provided", async () => {
    const svg = await generateSVG(mockCard, {
      baseColor: "#FF0000",
      category: "Frontend",
    });

    expect(svg).toContain('width="500"');
    expect(svg).toContain('height="810"');
    expect(svg).toContain('fill="#FF0000"');
  });

  it("should use default options when none provided", async () => {
    const svg = await generateSVG(mockCard);

    expect(svg).toContain('width="500"');
    expect(svg).toContain('height="810"');
    expect(svg).toContain("#17424A");
  });

  it("should handle empty taboo arrays", async () => {
    const emptyCard: TabooCard = {
      id: "test-empty",
      top: {
        index: 1,
        word: "Test",
        taboo: [],
        explanation: "",
        category: "Test",
      },
      bottom: {
        index: 2,
        word: "Empty",
        taboo: [],
        explanation: "",
        category: "Test",
      },
      createdAt: new Date(),
    };

    const svg = await generateSVG(emptyCard);
    expect(svg).toContain("Test");
    expect(svg).toContain("Empty");
    expect(svg.split("•").length - 1).toBe(0);
  });

  it("should handle special characters in words", async () => {
    const specialCard: TabooCard = {
      id: "test-special",
      top: {
        index: 1,
        word: "HTML & CSS",
        taboo: ["<script>", "CSS>"],
        explanation: "",
        category: "Test",
      },
      bottom: {
        index: 2,
        word: 'JS "Quotes"',
        taboo: ["'single'", '"double"'],
        explanation: "",
        category: "Test",
      },
      createdAt: new Date(),
    };

    const svg = await generateSVG(specialCard);
    expect(svg).toContain("HTML &");
    expect(svg).toContain("CSS");
    expect(svg).toContain('JS "Quotes"');
  });
});
