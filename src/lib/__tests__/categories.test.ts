import { describe, it, expect } from "vitest";
import {
  getCategoryColor,
  getCategoryTextColor,
} from "../constants/categories";

describe("categories", () => {
  describe("getCategoryColor", () => {
    it("should return correct colors for each category", () => {
      expect(getCategoryColor("General")).toBe("#93bcb8");
      expect(getCategoryColor("AI")).toBe("#e08185");
      expect(getCategoryColor("Software Engineering")).toBe("#ddc46f");
      expect(getCategoryColor("Data")).toBe("#562C2B");
      expect(getCategoryColor("DevOps")).toBe("#012B37");
    });

    it("should return default color for unknown category", () => {
      expect(getCategoryColor("Unknown")).toBe("#17424A");
    });

    it("should return correct text colors for each category", () => {
      expect(getCategoryTextColor("General")).toBe("#0A1F33");
      expect(getCategoryTextColor("AI")).toBe("#0A1F33");
      expect(getCategoryTextColor("Software Engineering")).toBe("#0A1F33");
      expect(getCategoryTextColor("Data")).toBe("#C9BEC2");
      expect(getCategoryTextColor("DevOps")).toBe("#9BD3D8");
    });

    it("should return default text color for unknown category", () => {
      expect(getCategoryTextColor("Unknown")).toBe("#FFFFFF");
    });
  });
});
