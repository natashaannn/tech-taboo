// Migrated from public/scripts/lib/categories.js
export const CATEGORIES = [
  'Frontend',
  'Backend', 
  'DevOps',
  'Mobile',
  'General'
] as const

export const CATEGORY_COLORS: Record<string, string> = {
  'Frontend': '#61DAFB',
  'Backend': '#68217A',
  'DevOps': '#2496ED',
  'Mobile': '#A4C639',
  'General': '#FF6B6B'
}

export const CATEGORY_TEXT_COLORS: Record<string, string> = {
  'Frontend': '#000000',
  'Backend': '#FFFFFF',
  'DevOps': '#FFFFFF',
  'Mobile': '#000000',
  'General': '#FFFFFF'
}

// Keywords for automatic category detection
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Frontend': ['react', 'vue', 'angular', 'css', 'html', 'javascript', 'typescript', 'sass', 'webpack', 'frontend', 'ui', 'ux', 'component', 'dom', 'browser', 'responsive'],
  'Backend': ['node', 'express', 'django', 'rails', 'api', 'database', 'sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'server', 'backend', 'microservice', 'rest', 'graphql'],
  'DevOps': ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci', 'cd', 'jenkins', 'github actions', 'terraform', 'ansible', 'devops', 'deployment', 'pipeline', 'infrastructure', 'cloud'],
  'Mobile': ['ios', 'android', 'react native', 'flutter', 'swift', 'kotlin', 'xamarin', 'cordova', 'phonegap', 'mobile', 'app', 'native', 'cross-platform'],
  'General': ['agile', 'scrum', 'kanban', 'git', 'github', 'gitlab', 'debugging', 'testing', 'code review', 'refactoring', 'clean code', 'design patterns', 'algorithm', 'data structure']
}

export function detectCategory(word: string): string {
  const lowerWord = word.toLowerCase()
  
  // Check for more specific terms first
  if (lowerWord.includes('react native') || lowerWord.includes('flutter') || 
      lowerWord.includes('swift') || lowerWord.includes('kotlin') ||
      lowerWord.includes('ios') || lowerWord.includes('android')) {
    return 'Mobile'
  }
  
  if (lowerWord.includes('docker') || lowerWord.includes('kubernetes') || 
      lowerWord.includes('aws') || lowerWord.includes('azure') ||
      lowerWord.includes('gcp') || lowerWord.includes('ci') ||
      lowerWord.includes('cd') || lowerWord.includes('jenkins')) {
    return 'DevOps'
  }
  
  if (lowerWord.includes('node') || lowerWord.includes('express') || 
      lowerWord.includes('database') || lowerWord.includes('api') ||
      lowerWord.includes('sql') || lowerWord.includes('nosql')) {
    return 'Backend'
  }
  
  if (lowerWord.includes('react') || lowerWord.includes('vue') || 
      lowerWord.includes('angular') || lowerWord.includes('css') ||
      lowerWord.includes('html') || lowerWord.includes('javascript')) {
    return 'Frontend'
  }
  
  return 'General'
}

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS['General']
}

export function getCategoryTextColor(category: string): string {
  return CATEGORY_TEXT_COLORS[category] || CATEGORY_TEXT_COLORS['General']
}
