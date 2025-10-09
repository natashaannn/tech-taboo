// public/scripts/lib/categories.js
export const CATEGORIES = [
  "Software Engineering",
  "Data",
  "AI",
  "Web3/Blockchain",
];

export const CATEGORY_KEYWORDS = {
  AI: [
    "ai","ml","machine learning","deep learning","neural","transformer","llm","gpt","chatgpt","dall-e","midjourney","anthropic","claude","gemini","slm","llama","fine-tuning","retrieval","vector","embedding","tokenization","vision","computer vision","voice","speech","text-to-speech","speech-to-text","multimodal","sam","rlhf","synthetic","diffusion","stable diffusion","diffusers","prompt","prompt engineering","alignment","hallucination","moderation","ethics","regulation","autonomous","agent",
  ],
  "Web3/Blockchain": [
    "blockchain","bitcoin","ethereum","web3","crypto","cryptocurrency","token","ledger","defi","nft","smart contract",
  ],
  Data: [
    "data","database","sql","nosql","etl","bi","business intelligence","visualization","warehouse","lakehouse","analytics","mining","predictive","governance","elasticsearch","kafka","rabbitmq","redis",
  ],
  "Software Engineering": [
    "api","http","rest","graphql","websocket","react","vue","angular","node","express","docker","kubernetes","git","compiler","debug","ide","microservices","devops","ci/cd","pipeline","test","unit","integration","regression","staging","production","rollback","hotfix","feature flag","scrum","sprint","responsive","bootstrap","tailwind","spa","ssr","pwa","service worker","oauth","jwt","browser","html","css","javascript","server","cache","router","firewall","bandwidth","lan","wan","dns","ip","tls","ssl","certificate",
  ],
};

export function detectCategory(word) {
  const w = word.toLowerCase();
  if (CATEGORY_KEYWORDS["Web3/Blockchain"].some((k) => w.includes(k))) return "Web3/Blockchain";
  if (CATEGORY_KEYWORDS.AI.some((k) => w.includes(k))) return "AI";
  if (CATEGORY_KEYWORDS.Data.some((k) => w.includes(k))) return "Data";
  return "Software Engineering";
}

// Ensure each item has a category property. If missing, infer from word.
export function ensureCategories(tabooList) {
  return tabooList.map((item) => ({
    ...item,
    category: item.category || detectCategory(item.word),
  }));
}

export function buildCategoryMaps(tabooList) {
  const ensured = ensureCategories(tabooList);
  const map = Object.fromEntries(CATEGORIES.map((c) => [c, []]));
  ensured.forEach((item, index) => {
    const cat = item.category;
    if (!map[cat]) map[cat] = [];
    map[cat].push({ index, word: item.word });
  });
  return map;
}
