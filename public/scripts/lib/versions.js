export const DEFAULT_VERSION_ID = "VARIETY_PACK";

export const VERSION_DEFINITIONS = [
  {
    id: "VARIETY_PACK",
    label: "Variety Pack Version",
    categoryCounts: {
      "General": 60,
      "AI": 16,
      "Software Engineering": 16,
      "Product Management": 16,
    },
  },
  {
    id: "SOFTWARE_INTERVIEW_EXTENSION",
    label: "Software Interview Prep Extension Pack",
    categoryCounts: {
      "Data Structures & Algorithms": 52,
      "System Design": 52,
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
