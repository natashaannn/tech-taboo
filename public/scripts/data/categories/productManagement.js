// Product Management Terms - 34 cards
export const productManagementTabooList = [
  // start of variety pack
  { index: 1, word: "A/B Testing", taboo: ["Experiment", "Variant", "Conversion", "Split", "Test"], explanation: "Comparing two versions of something to see which performs better by showing each to different groups." },
  { index: 2, word: "Acceptance Criteria", taboo: ["Requirements", "Story", "Definition", "Done", "Validate"], explanation: "Specific conditions that must be met for a feature to be considered complete and ready to ship." },
  { index: 3, word: "Backlog", taboo: ["Tasks", "Stories", "Queue", "Prioritize", "Jira"], explanation: "A prioritized list of work items waiting to be completed by the team." },
  { index: 4, word: "Story Points", taboo: ["Estimate", "Effort", "Complexity", "Agile", "Fibonacci"], explanation: "A unit of measure for expressing the relative difficulty of completing a piece of work." },
  { index: 5, word: "User Story", taboo: ["Requirement", "Feature", "As a", "Agile", "Backlog"], explanation: "A simple description of a feature from the perspective of the person who will use it." },
  { index: 6, word: "Business Case", taboo: ["Justification", "ROI", "Investment", "Value", "Proposal"], explanation: "A document that explains why a project is worth pursuing and what benefits it will bring." },
  { index: 7, word: "Wireframe", taboo: ["Mockup", "Design", "Sketch", "Layout", "Prototype"], explanation: "A simple visual guide showing the structure and layout of a page or screen." },
  { index: 8, word: "Customer Journey", taboo: ["Experience", "Touchpoint", "Path", "User", "Map"], explanation: "The complete series of interactions someone has with a product or service from start to finish." },
  { index: 9, word: "Daily Standup", taboo: ["Meeting", "Scrum", "Update", "Sync", "15 Minutes"], explanation: "A brief daily gathering where team members share progress, plans, and blockers." },
  { index: 10, word: "Epic", taboo: ["Story", "Large", "Feature", "Jira", "Initiative"], explanation: "A big chunk of work that can be broken down into smaller tasks or features." },
  { index: 11, word: "Technical Debt", taboo: ["Code", "Refactor", "Shortcuts", "Maintenance", "Quality"], explanation: "The implied cost of rework caused by choosing quick solutions now instead of better approaches that take longer." },
  { index: 12, word: "Retrospective", taboo: ["Meeting", "Review", "Sprint", "Improve", "Reflect"], explanation: "A team session to reflect on what went well, what didn't, and how to improve going forward." },
  { index: 13, word: "Impact", taboo: ["Effect", "Result", "Outcome", "Influence", "Change"], explanation: "The measurable difference or value that a feature or decision creates for users or the business." },
  { index: 14, word: "Iteration", taboo: ["Cycle", "Sprint", "Repeat", "Improve", "Version"], explanation: "A time-boxed period where a team works to complete a set of planned work items." },
  { index: 15, word: "Roadmap", taboo: ["Plan", "Timeline", "Features", "Strategy", "Vision"], explanation: "A high-level visual summary showing the direction and major milestones for a product over time." },
  { index: 16, word: "Persona", taboo: ["User", "Profile", "Archetype", "Customer", "Segment"], explanation: "A fictional character representing a typical user type, based on research and data." },
  // end of variety pack
  { index: 17, word: "Product Document Review (PDR)", taboo: ["Specification", "Approval", "Requirements", "Design", "Meeting"] },
  { index: 18, word: "Product Market Fit", taboo: ["Demand", "Match", "Customers", "Value", "Success"] },
  { index: 19, word: "Product Sense", taboo: ["Intuition", "Judgment", "Vision", "Understanding", "Instinct"] },
  { index: 20, word: "Product-Led Growth", taboo: ["Strategy", "Acquisition", "Viral", "Self-Service", "Freemium"] },
  { index: 21, word: "Return on Investment (ROI)", taboo: ["Interest", "Cost", "Profit", "Value", "Benefit"] },
  { index: 22, word: "Go-to-Market Strategy", taboo: ["Launch", "Plan", "Sales", "Marketing", "Release"] },
  { index: 23, word: "North Star Metric", taboo: ["Goal", "KPI", "Success", "Measure", "Focus"] },
  { index: 24, word: "Stakeholder", taboo: ["Interested", "Party", "Investor", "Influence", "Owner"] },
  { index: 25, word: "Backlog Grooming", taboo: ["Refinement", "Stories", "Prioritize", "Estimate", "Clean"] },
  { index: 26, word: "Feature Flag", taboo: ["Toggle", "Release", "Enable", "Control", "Rollout"]},
  { index: 27, word: "Use Case", taboo: ["Scenario", "User", "Story", "Example", "Application"] },
  { index: 28, word: "User Acquisition", taboo: ["Growth", "Customers", "Marketing", "Onboarding", "Sign-up"] },
  { index: 29, word: "User Flow", taboo: ["Path", "Steps", "Navigation", "Interaction", "Diagram"] },
  { index: 30, word: "User Research", taboo: ["Interview", "Survey", "Feedback", "Study", "Insights"] },
  { index: 31, word: "Beta Testing", taboo: ["Users", "Early", "Feedback", "Release", "Preview"] },
];

productManagementTabooList.forEach(item => {
  item.category = "Product Management";
});
