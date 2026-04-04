// Edition definitions - can exist without packaging

export const PACKAGING_EDITIONS = {
  VARIETY_PACK: {
    label: "Variety Pack",
    fullLabel: "Variety Pack Version",
    categories: ["General", "AI", "Software Engineering", "Product Management"],
    description:
      "A card game for a broad mix of core tech, AI, engineering, and product topics.",
    categoryCounts: {
      General: 88,
      AI: 32,
      "Software Engineering": 32,
      "Product Management": 32,
      "Responsible Tech": 32,
    },
  },
  SOFTWARE_INTERVIEW_EXTENSION: {
    label: "Software Interview Prep",
    fullLabel: "Software Interview Prep Extension Pack",
    categories: [
      "DSA",
      "System Design",
      "Software Engineering",
      "Product Management",
    ],
    description:
      "A card game for interview prep across algorithms, system design, and software.",
    categoryCounts: {
      DSA: 52,
      "System Design": 52,
      "Software Engineering": 100,
      "Product Management": 12,
    },
  },
  DEVSEC_PACK: {
    label: "DevSecOps Pack",
    fullLabel: "DevSecOps Pack",
    categories: ["DevOps", "Cybersecurity"],
    description:
      "A card game for secure delivery, operations, and cyber defense discussions.",
    categoryCounts: {
      DevOps: 52,
      Cybersecurity: 52,
    },
  },
  PRODUCT_EXPERIENCE_PACK: {
    label: "Product Pack",
    fullLabel: "Product Pack",
    categories: ["Product Management", "UX Design"],
    description:
      "A card game for product strategy and user experience conversations.",
    categoryCounts: {
      "Product Management": 52,
      "UX Design": 52,
    },
  },
  DATA_AI_PACK: {
    label: "Data + AI Pack",
    fullLabel: "Data+AI Pack",
    categories: ["Data", "AI"],
    description: "A card game for data foundations and applied AI concepts.",
    categoryCounts: {
      Data: 52,
      AI: 52,
    },
  },
  ENGINEERING_GAME_PACK: {
    label: "Engineering + Game Dev Pack",
    fullLabel: "SWE+GameDev Pack",
    categories: ["Software Engineering", "Game Development"],
    description:
      "A card game for software craftsmanship and game development techniques.",
    categoryCounts: {
      "Software Engineering": 52,
      "Game Development": 52,
    },
  },
  RESPONSIBLE_TECH_PACK: {
    label: "Responsible Tech Pack",
    fullLabel: "Responsible Tech Pack",
    categories: ["Responsible Tech"],
    description:
      "A card game for ethics, privacy, trust, and sustainable technology.",
    categoryCounts: {
      "Responsible Tech": 52,
    },
  },
};

export const DEFAULT_EDITION_ID = "VARIETY_PACK";

// Helper functions using the edition data
export function getEditionCounts(editionId: string) {
  const edition =
    PACKAGING_EDITIONS[editionId as keyof typeof PACKAGING_EDITIONS];
  return edition ? { ...edition.categoryCounts } : null;
}

export function getEditionLabel(editionId: string, fullLabel = false) {
  const edition =
    PACKAGING_EDITIONS[editionId as keyof typeof PACKAGING_EDITIONS];
  return edition ? (fullLabel ? edition.fullLabel : edition.label) : null;
}

// Legacy exports for backward compatibility
export const PACKAGING_VERSIONS = PACKAGING_EDITIONS;
export const VERSION_DEFINITIONS = Object.entries(PACKAGING_EDITIONS).map(
  ([key, value]) => ({
    id: key,
    label: value.fullLabel,
    categoryCounts: value.categoryCounts,
  }),
);
export const DEFAULT_VERSION_ID = DEFAULT_EDITION_ID;
export function getVersionCounts(versionId: string) {
  return getEditionCounts(versionId);
}
export function getVersionLabel(versionId: string, fullLabel = false) {
  return getEditionLabel(versionId, fullLabel);
}
