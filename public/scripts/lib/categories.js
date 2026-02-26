// public/scripts/lib/categories.js
export const CATEGORIES = [
  "General",
  "Software Engineering",
  "Data",
  "AI",
  "Product Management",
  "Data Structures & Algorithms",
  "System Design",
  "Game Development",
  "DevOps",
  "Cybersecurity",
  "UX Design",
  "Responsible Tech",
];

// Default colors for each category
// Checked for WCAG AA Large Text Contrast on https://webaim.org/resources/contrastchecker/
// Used VSCode theme colors
export const CATEGORY_COLORS = {
  "General": "#DCECF0", // Noctis Hibernicus       
  "AI": "#FAFAFA", // Atom One Light
  "Data": "#562C2B", // Noctis Bordo
  "Product Management": "#FDF8ED", // Noctis Lux
  "Software Engineering": "#282A36", // Darcula
  "Data Structures & Algorithms": "#DFDDF1", // Noctis Lilac
  "System Design": "#0B2942", // Night Owl
  "Game Development": "#FFC7D0", // Pink Lemonade
  "DevOps": "#012B37", // Vue Theme
  "Cybersecurity": "#B6C7CA", // Noctis Sereno
  "UX Design": "#FEF9EC", // Solarized Light
  "Responsible Tech": "#B0D0B8", // Earthbound
};

// Text title colors for each category
export const CATEGORY_TEXT_COLORS = {
  "General": "#23555F", // Noctis Hibernicus
  "AI": "#383A42", // Atom One Light
  "Data": "#C9BEC2", // Noctis Bordo
  "Product Management": "#23555F", // Noctis Lux
  "Software Engineering": "#F8F8F2", // Darcula
  "Data Structures & Algorithms": "#1C1372", // Noctis Lilac
  "System Design": "#669CF2", // Night Owl
  "Game Development": "#816E7D", // Pink Lemonade
  "DevOps": "#9BD3D8", // Vue Theme
  "Cybersecurity": "#132D31", // Noctis Sereno
  "UX Design": "#2AA198", // Solarized Light
  "Responsible Tech": "#3D482D", // Earthbound
};

// VSCode editor theme names that inspired each category palette
export const CATEGORY_THEME_NAMES = {
  "General": "Noctis Hibernicus",
  "AI": "Atom One Light",
  "Data": "Noctis Bordo",
  "Product Management": "Noctis Lux",
  "Software Engineering": "Darcula",
  "Data Structures & Algorithms": "Noctis Lilac",
  "System Design": "Night Owl",
  "Game Development": "Pink Lemonade",
  "DevOps": "Vue Theme",
  "Cybersecurity": "Noctis Sereno",
  "UX Design": "Solarized Light",
  "Responsible Tech": "Earthbound",
};

export const CATEGORY_KEYWORDS = {
  AI: [
    "ai","ml","machine learning","deep learning","neural","transformer","llm","gpt","chatgpt","dall-e","midjourney","anthropic","claude","gemini","slm","llama","fine-tuning","retrieval","vector","embedding","tokenization","vision","computer vision","voice","speech","text-to-speech","speech-to-text","multimodal","sam","rlhf","synthetic","diffusion","stable diffusion","diffusers","prompt","prompt engineering","alignment","hallucination","moderation","ethics","regulation","autonomous","agent","federated","few-shot","zero-shot","one-shot",
  ],
  Data: [
    "data","database","sql","nosql","etl","bi","business intelligence","visualization","warehouse","lakehouse","analytics","mining","predictive","governance","elasticsearch","kafka","rabbitmq","redis",
  ],
  "Software Engineering": [
    "api","http","rest","graphql","websocket","react","vue","angular","node","express","docker","kubernetes","git","compiler","debug","ide","microservices","devops","ci/cd","pipeline","test","unit","integration","regression","staging","production","rollback","hotfix","responsive","bootstrap","tailwind","spa","ssr","pwa","service worker","oauth","jwt","browser","html","css","javascript","server","cache","router","firewall","bandwidth","lan","wan","dns","ip","tls","ssl","certificate","cloud","aws","azure","gcp",
  ],
  "Product Management": [
    "product","roadmap","backlog","epic","user story","persona","mvp","minimum viable product","kpi","okr","agile","scrum","sprint","standup","retrospective","iteration","velocity","story points","acceptance criteria","use case","user journey","customer journey","stakeholder","product sense","product market fit","product-led","churn","retention","a/b testing","beta","wireframe","prototype","go-to-market","gtm","pivot","value proposition","north star","user research","user acquisition","pdr","product document review","impact","roi","return on investment","rate of interest","technical debt","grooming","refinement",
  ],
  "Data Structures & Algorithms": [
    "array","linked list","stack","queue","hash","tree","graph","heap","trie","sort","search","bfs","dfs","dijkstra","dynamic programming","greedy","backtracking","divide and conquer","recursion","big o","pointer","avl","red-black","b-tree","segment tree","fenwick","disjoint","topological","spanning tree","bellman","floyd","knapsack","traveling salesman","two pointers","sliding window","kadane","bst","collision","radix","counting sort","bucket sort","heap sort","merge sort","quick sort","bubble sort","insertion sort","selection sort","binary search",
  ],
  "System Design": [
    "load balancer","microservices","scalability","scaling","horizontal","vertical","caching","sharding","cdn","content delivery","message queue","api gateway","rate limiting","consistent hashing","cap theorem","eventual consistency","replication","proxy","reverse proxy","service discovery","circuit breaker","idempotency","indexing","distributed lock","event sourcing","saga","two-phase commit","write-ahead log","gossip protocol","quorum","leader election","heartbeat","back pressure","bulkhead","sidecar","partitioning","replica","write-through","write-back","sticky session","stateless","stateful","latency","throughput","fault tolerance","high availability","single point of failure","connection pool","denormalization","normalization","ttl","time to live","webhook","polling","long polling",
  ],
};

export function detectCategory(word) {
  const w = word.toLowerCase();
  if (CATEGORY_KEYWORDS.AI.some((k) => w.includes(k))) return "AI";
  if (CATEGORY_KEYWORDS["Data Structures & Algorithms"].some((k) => w.includes(k))) return "Data Structures & Algorithms";
  if (CATEGORY_KEYWORDS["System Design"].some((k) => w.includes(k))) return "System Design";
  if (CATEGORY_KEYWORDS.Data.some((k) => w.includes(k))) return "Data";
  if (CATEGORY_KEYWORDS["Product Management"].some((k) => w.includes(k))) return "Product Management";
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

// Get the default color for a category
export function getCategoryColor(category) {
  return CATEGORY_COLORS[category] || "#17424A"; // fallback to classic teal
}

// Get the text title color for a category
export function getCategoryTextColor(category) {
  return CATEGORY_TEXT_COLORS[category] || "#ffffff"; // fallback to white
}
