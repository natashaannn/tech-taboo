// Packaging-specific constants

import { CATEGORIES } from "./categories";
import { PACKAGING_EDITIONS } from "./editions";

export const PACKAGING_SELECTIONS = [
  ...Object.entries(PACKAGING_EDITIONS).map(([key, value]) => ({
    key,
    label: value.label,
    type: "edition" as const,
  })),
  ...CATEGORIES.filter(
    (category) =>
      !Object.values(PACKAGING_EDITIONS).some((edition) =>
        edition.categories.includes(category),
      ),
  ).map((category) => ({
    key: category,
    label: category,
    type: "category" as const,
  })),
];

export const PACKAGING_PANEL_MM = {
  lidTop: { width: 66, height: 95 },
  longSide: { width: 95, height: 29.4 },
  shortSide: { width: 29.4, height: 66 },
};
