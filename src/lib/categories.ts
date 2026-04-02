// Migrated from public/scripts/lib/categories.js
export const CATEGORIES = [
  'General',
  'AI',
  'Software Engineering',
  'Data',
  'Product Management',
  'DSA',
  'System Design',
  'Game Dev',
  'DevOps',
  'Cybersecurity',
  'UX Design',
  'Responsible Tech'
] as const

export const CATEGORY_COLORS: Record<string, string> = {
  'General': '#FF6B6B',
  'AI': '#8B5CF6',
  'Software Engineering': '#3B82F6',
  'Data': '#10B981',
  'Product Management': '#F59E0B',
  'DSA': '#EF4444',
  'System Design': '#8B5CF6',
  'Game Dev': '#EC4899',
  'DevOps': '#2496ED',
  'Cybersecurity': '#059669',
  'UX Design': '#F59E0B',
  'Responsible Tech': '#6B7280'
}

export const CATEGORY_TEXT_COLORS: Record<string, string> = {
  'General': '#FFFFFF',
  'AI': '#FFFFFF',
  'Software Engineering': '#FFFFFF',
  'Data': '#FFFFFF',
  'Product Management': '#FFFFFF',
  'DSA': '#FFFFFF',
  'System Design': '#FFFFFF',
  'Game Dev': '#FFFFFF',
  'DevOps': '#FFFFFF',
  'Cybersecurity': '#FFFFFF',
  'UX Design': '#FFFFFF',
  'Responsible Tech': '#FFFFFF'
}


export function detectCategory(word: string): string {
  const lowerWord = word.toLowerCase()
  
  // AI category
  if (lowerWord.includes('artificial intelligence') || lowerWord.includes('ai') ||
      lowerWord.includes('machine learning') || lowerWord.includes('ml') ||
      lowerWord.includes('neural network') || lowerWord.includes('deep learning') ||
      lowerWord.includes('chatgpt') || lowerWord.includes('model') ||
      lowerWord.includes('training') || lowerWord.includes('llm')) {
    return 'AI'
  }

  // Data category
  if (lowerWord.includes('data') || lowerWord.includes('database') ||
      lowerWord.includes('analytics') || lowerWord.includes('big data') ||
      lowerWord.includes('data science') || lowerWord.includes('warehouse') ||
      lowerWord.includes('sql') || lowerWord.includes('nosql')) {
    return 'Data'
  }

  // DevOps category
  if (lowerWord.includes('docker') || lowerWord.includes('kubernetes') || 
      lowerWord.includes('aws') || lowerWord.includes('azure') ||
      lowerWord.includes('gcp') || lowerWord.includes('ci') ||
      lowerWord.includes('cd') || lowerWord.includes('jenkins') ||
      lowerWord.includes('deployment') || lowerWord.includes('infrastructure')) {
    return 'DevOps'
  }

  // Software Engineering category
  if (lowerWord.includes('code') || lowerWord.includes('programming') ||
      lowerWord.includes('debugging') || lowerWord.includes('refactoring') ||
      lowerWord.includes('software') || lowerWord.includes('development') ||
      lowerWord.includes('testing') || lowerWord.includes('algorithm')) {
    return 'Software Engineering'
  }

  // DSA category
  if (lowerWord.includes('algorithm') || lowerWord.includes('data structure') ||
      lowerWord.includes('array') || lowerWord.includes('linked list') ||
      lowerWord.includes('tree') || lowerWord.includes('graph') ||
      lowerWord.includes('sorting') || lowerWord.includes('searching')) {
    return 'DSA'
  }

  // System Design category
  if (lowerWord.includes('system design') || lowerWord.includes('architecture') ||
      lowerWord.includes('scalability') || lowerWord.includes('microservices') ||
      lowerWord.includes('load balancer') || lowerWord.includes('caching')) {
    return 'System Design'
  }

  // Game Dev category
  if (lowerWord.includes('game') || lowerWord.includes('unity') ||
      lowerWord.includes('unreal') || lowerWord.includes('gaming')) {
    return 'Game Dev'
  }

  // Cybersecurity category
  if (lowerWord.includes('security') || lowerWord.includes('cybersecurity') ||
      lowerWord.includes('encryption') || lowerWord.includes('hacking') ||
      lowerWord.includes('firewall') || lowerWord.includes('authentication')) {
    return 'Cybersecurity'
  }

  // UX Design category
  if (lowerWord.includes('ux') || lowerWord.includes('design') ||
      lowerWord.includes('user experience') || lowerWord.includes('interface') ||
      lowerWord.includes('prototype') || lowerWord.includes('wireframe')) {
    return 'UX Design'
  }

  // Product Management category
  if (lowerWord.includes('product') || lowerWord.includes('management') ||
      lowerWord.includes('agile') || lowerWord.includes('scrum') ||
      lowerWord.includes('backlog') || lowerWord.includes('sprint')) {
    return 'Product Management'
  }

  // Responsible Tech category
  if (lowerWord.includes('ethics') || lowerWord.includes('responsible') ||
      lowerWord.includes('privacy') || lowerWord.includes('sustainability')) {
    return 'Responsible Tech'
  }

  return 'General'
}

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS['General']
}

export function getCategoryTextColor(category: string): string {
  return CATEGORY_TEXT_COLORS[category] || CATEGORY_TEXT_COLORS['General']
}
