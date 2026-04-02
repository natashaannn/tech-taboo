// Migrated from public/scripts/lib/categories.js

export interface CategoryConfig {
  color: string;
  textColor: string;
}

export const CATEGORY_DESCRIPTIONS = {
  General: "A card game for broad, cross-functional technology conversations.",
  "Software Engineering":
    "A card game for coding, systems, APIs, and software delivery.",
  Data: "A card game for analytics, pipelines, and data-driven decision making.",
  AI: "A card game for practical AI, models, prompts, and intelligent workflows.",
  "Product Management":
    "A card game for strategy, prioritization, and product outcomes.",
  "Data Structures & Algorithms":
    "A card game for algorithms, complexity, and interview fundamentals.",
  "System Design":
    "A card game for scalable architecture and distributed system tradeoffs.",
  "Game Development":
    "A card game for engines, gameplay systems, and interactive development.",
  DevOps:
    "A card game for automation, deployment, observability, and reliability.",
  Cybersecurity:
    "A card game for threats, defenses, and secure engineering practices.",
  "UX Design":
    "A card game for user research, interaction design, and usability.",
  "Responsible Tech":
    "A card game for ethics, privacy, trust, and sustainable technology.",
};

export const CATEGORIES_CONFIG: Record<string, CategoryConfig> = {
  General: {
    color: "#93bcb8",
    textColor: "#0A1F33",
  },
  AI: {
    color: "#e08185",
    textColor: "#0A1F33",
  },
  "Software Engineering": {
    color: "#ddc46f",
    textColor: "#0A1F33",
  },
  Data: {
    color: "#562C2B",
    textColor: "#C9BEC2",
  },
  "Product Management": {
    color: "#815c4c",
    textColor: "#efe7e4",
  },
  DSA: {
    color: "#DFDDF1",
    textColor: "#1C1372",
  },
  "System Design": {
    color: "#0B2942",
    textColor: "#669CF2",
  },
  "Game Dev": {
    color: "#FFC7D0",
    textColor: "#816E7D",
  },
  DevOps: {
    color: "#012B37",
    textColor: "#9BD3D8",
  },
  Cybersecurity: {
    color: "#B6C7CA",
    textColor: "#132D31",
  },
  "UX Design": {
    color: "#FEF9EC",
    textColor: "#2AA198",
  },
  "Responsible Tech": {
    color: "#B0D0B8",
    textColor: "#3D482D",
  },
};

export const CATEGORIES = Object.keys(CATEGORIES_CONFIG) as readonly string[];

// Helper functions for backward compatibility
export const getCategoryColor = (category: string): string => {
  return CATEGORIES_CONFIG[category]?.color || "#17424A";
};

export const getCategoryTextColor = (category: string): string => {
  return CATEGORIES_CONFIG[category]?.textColor || "#FFFFFF";
};

// Legacy exports for backward compatibility
export const CATEGORY_COLORS: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORIES_CONFIG).map(([key, config]) => [key, config.color]),
);

export const CATEGORY_TEXT_COLORS: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORIES_CONFIG).map(([key, config]) => [
    key,
    config.textColor,
  ]),
);

export function detectCategory(word: string): string {
  const lowerWord = word.toLowerCase();

  // AI category
  if (
    lowerWord.includes("artificial intelligence") ||
    lowerWord.includes("ai") ||
    lowerWord.includes("machine learning") ||
    lowerWord.includes("ml") ||
    lowerWord.includes("neural network") ||
    lowerWord.includes("deep learning") ||
    lowerWord.includes("chatgpt") ||
    lowerWord.includes("model") ||
    lowerWord.includes("training") ||
    lowerWord.includes("llm")
  ) {
    return "AI";
  }

  // Data category
  if (
    lowerWord.includes("data") ||
    lowerWord.includes("database") ||
    lowerWord.includes("analytics") ||
    lowerWord.includes("big data") ||
    lowerWord.includes("data science") ||
    lowerWord.includes("warehouse") ||
    lowerWord.includes("sql") ||
    lowerWord.includes("nosql")
  ) {
    return "Data";
  }

  // DevOps category
  if (
    lowerWord.includes("docker") ||
    lowerWord.includes("kubernetes") ||
    lowerWord.includes("aws") ||
    lowerWord.includes("azure") ||
    lowerWord.includes("gcp") ||
    lowerWord.includes("ci") ||
    lowerWord.includes("cd") ||
    lowerWord.includes("jenkins") ||
    lowerWord.includes("deployment") ||
    lowerWord.includes("infrastructure")
  ) {
    return "DevOps";
  }

  // Software Engineering category
  if (
    lowerWord.includes("code") ||
    lowerWord.includes("programming") ||
    lowerWord.includes("debugging") ||
    lowerWord.includes("refactoring") ||
    lowerWord.includes("software") ||
    lowerWord.includes("development") ||
    lowerWord.includes("testing") ||
    lowerWord.includes("algorithm")
  ) {
    return "Software Engineering";
  }

  // DSA category
  if (
    lowerWord.includes("algorithm") ||
    lowerWord.includes("data structure") ||
    lowerWord.includes("array") ||
    lowerWord.includes("linked list") ||
    lowerWord.includes("tree") ||
    lowerWord.includes("graph") ||
    lowerWord.includes("sorting") ||
    lowerWord.includes("searching")
  ) {
    return "DSA";
  }

  // System Design category
  if (
    lowerWord.includes("system design") ||
    lowerWord.includes("architecture") ||
    lowerWord.includes("scalability") ||
    lowerWord.includes("microservices") ||
    lowerWord.includes("load balancer") ||
    lowerWord.includes("caching")
  ) {
    return "System Design";
  }

  // Game Dev category
  if (
    lowerWord.includes("game") ||
    lowerWord.includes("unity") ||
    lowerWord.includes("unreal") ||
    lowerWord.includes("gaming")
  ) {
    return "Game Dev";
  }

  // Cybersecurity category
  if (
    lowerWord.includes("security") ||
    lowerWord.includes("cybersecurity") ||
    lowerWord.includes("encryption") ||
    lowerWord.includes("hacking") ||
    lowerWord.includes("firewall") ||
    lowerWord.includes("authentication")
  ) {
    return "Cybersecurity";
  }

  // UX Design category
  if (
    lowerWord.includes("ux") ||
    lowerWord.includes("design") ||
    lowerWord.includes("user experience") ||
    lowerWord.includes("interface") ||
    lowerWord.includes("prototype") ||
    lowerWord.includes("wireframe")
  ) {
    return "UX Design";
  }

  // Product Management category
  if (
    lowerWord.includes("product") ||
    lowerWord.includes("management") ||
    lowerWord.includes("agile") ||
    lowerWord.includes("scrum") ||
    lowerWord.includes("backlog") ||
    lowerWord.includes("sprint")
  ) {
    return "Product Management";
  }

  // Responsible Tech category
  if (
    lowerWord.includes("ethics") ||
    lowerWord.includes("responsible") ||
    lowerWord.includes("privacy") ||
    lowerWord.includes("sustainability")
  ) {
    return "Responsible Tech";
  }

  return "General";
}
