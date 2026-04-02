// Migrated from public/scripts/data/tabooList.js
export const tabooList = [
  // Frontend
  {
    top: { word: "React", taboos: ["JavaScript", "Library", "Facebook", "Components", "Virtual DOM"] },
    bottom: { word: "State", taboos: ["Data", "Management", "useState", "Redux", "Props"] }
  },
  {
    top: { word: "CSS", taboos: ["Stylesheet", "Styling", "HTML", "Selectors", "Cascading"] },
    bottom: { word: "Flexbox", taboos: ["Layout", "Display", "Align", "Justify", "Grid"] }
  },
  {
    top: { word: "JavaScript", taboos: ["JS", "Scripting", "Browser", "ECMAScript", "Dynamic"] },
    bottom: { word: "Closure", taboos: ["Function", "Scope", "Lexical", "Encapsulation", "Variables"] }
  },
  // Backend
  {
    top: { word: "API", taboos: ["Interface", "REST", "GraphQL", "Endpoints", "Backend"] },
    bottom: { word: "Database", taboos: ["SQL", "NoSQL", "Storage", "Queries", "ORM"] }
  },
  {
    top: { word: "Node.js", taboos: ["JavaScript", "Runtime", "Server", "NPM", "Event Loop"] },
    bottom: { word: "Express", taboos: ["Framework", "Middleware", "Routing", "HTTP", "Server"] }
  },
  // DevOps
  {
    top: { word: "Docker", taboos: ["Container", "Virtualization", "Image", "Kubernetes", "Microservices"] },
    bottom: { word: "CI/CD", taboos: ["Pipeline", "Deployment", "Automation", "Jenkins", "GitHub Actions"] }
  },
  {
    top: { word: "Git", taboos: ["Version Control", "GitHub", "Commit", "Branch", "Merge"] },
    bottom: { word: "Cloud", taboos: ["AWS", "Azure", "GCP", "Hosting", "Scalability"] }
  },
  // Mobile
  {
    top: { word: "React Native", taboos: ["Mobile", "JavaScript", "iOS", "Android", "Cross-platform"] },
    bottom: { word: "Swift", taboos: ["iOS", "Apple", "Programming", "Xcode", "Mobile App"] }
  },
  {
    top: { word: "Flutter", taboos: ["Google", "Mobile", "Dart", "Cross-platform", "UI"] },
    bottom: { word: "Kotlin", taboos: ["Android", "JetBrains", "Java Alternative", "Mobile", "JVM"] }
  },
  // General Concepts
  {
    top: { word: "Agile", taboos: ["Methodology", "Scrum", "Sprints", "Standup", "Backlog"] },
    bottom: { word: "Code Review", taboos: ["PR", "Pull Request", "Feedback", "Quality", "Collaboration"] }
  },
  {
    top: { word: "Debugging", taboos: ["Bug", "Error", "Breakpoint", "Console", "Testing"] },
    bottom: { word: "Refactoring", taboos: ["Code", "Improvement", "Clean Code", "Technical Debt", "Restructuring"] }
  }
] as const
