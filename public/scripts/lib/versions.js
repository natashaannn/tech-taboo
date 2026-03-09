export const DEFAULT_VERSION_ID = "VARIETY_PACK";

// Each pack should have 216 terms (54 cards back and front total per deck)
export const VERSION_DEFINITIONS = [
  {
    id: "VARIETY_PACK",
    label: "Variety Pack Version",
    categoryCounts: {
      "General": 88,
      "AI": 32,
      "Software Engineering": 32,
      "Product Management": 32,
      "Responsible Tech": 32,
    },
  },
  {
    id: "SOFTWARE_INTERVIEW_EXTENSION",
    label: "Software Interview Prep Extension Pack",
    categoryCounts: {
      "Data Structures & Algorithms": 52,
      "System Design": 52,
      "Software Engineering": 100,
      "Product Management": 12,
    },
  },
    {
      id: "DEVSECOPS_PACK",
      label: "DevSecOps Pack",
      categoryCounts: {
        "DevOps": 52,
        "Cybersecurity": 52,
      },
    },
    {
      id: "PRODUCT_PACK",
      label: "Product Pack",
      categoryCounts: {
        "Product Management": 52,
        "UX Design": 52,
      },
    },
    {
      id: "Data_AI_PACK",
      label: "Data+AI Pack",
      categoryCounts: {
        "Data": 52,
        "AI": 52,
      },
    },
    {
      id: "SWE_GAME_DEV_PACK",
      label: "SWE+GameDev Pack",
      categoryCounts: {
        "Software Engineering": 52,
        "Game Development": 52,
      },
    },
  {
    id: "RESPONSIBLE_TECH_PACK",
    label: "Responsible Tech Pack",
    categoryCounts: {
      "Responsible Tech": 52,
    },
  },
];

export function getVersionCounts(versionId) {
  const match = VERSION_DEFINITIONS.find((v) => v.id === versionId);
  return match ? { ...match.categoryCounts } : null;
}

export function getVersionLabel(versionId) {
  const match = VERSION_DEFINITIONS.find((v) => v.id === versionId);
  return match ? match.label : null;
}
