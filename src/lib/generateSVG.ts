// Migrated from public/scripts/lib/generateSVG.js
import { TabooCard, CardGenerationOptions } from '@/types/taboo'
import { getCategoryColor, getCategoryTextColor } from './categories'

const DEFAULT_OPTIONS: Required<CardGenerationOptions> = {
  baseColor: '#17424A',
  background: '#FFFFFF',
  strokeColor: '#17424A',
  matchStrokeBackground: true,
  showBleed: false,
  category: undefined,
  teacherImage: undefined,
  peekOutImage: undefined
}

export function generateSVG(card: TabooCard, options: Partial<CardGenerationOptions> = {}): string {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const { top, bottom } = card
  
  // Determine colors
  let cardColor = opts.baseColor
  let textColor = '#FFFFFF'
  
  if (!opts.useCustomColor && opts.category) {
    cardColor = getCategoryColor(opts.category)
    textColor = getCategoryTextColor(opts.category)
  }
  
  // Generate gradient
  const gradientId = `gradient-${card.id}`
  const gradient = `
    <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${cardColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${opts.strokeColor};stop-opacity:1" />
    </linearGradient>
  `
  
  // Card dimensions
  const width = opts.showBleed ? 650 : 610
  const height = opts.showBleed ? 950 : 910
  const bleed = opts.showBleed ? 20 : 0
  
  // SVG content
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${gradient}
        <style>
          .card-text { 
            font-family: 'Monospace', 'Sometype Mono', monospace; 
            font-size: 32px; 
            font-weight: bold; 
            fill: ${textColor};
            text-anchor: middle;
            dominant-baseline: middle;
          }
          .taboo-text {
            font-family: 'Monospace', 'Sometype Mono', monospace;
            font-size: 20px;
            fill: ${textColor};
            opacity: 0.9;
            text-anchor: middle;
            dominant-baseline: middle;
          }
          .category-text {
            font-family: 'Monospace', 'Sometype Mono', monospace;
            font-size: 16px;
            fill: ${textColor};
            opacity: 0.8;
            text-anchor: middle;
            dominant-baseline: middle;
          }
        </style>
      </defs>
      
      <!-- Card background -->
      <rect x="${bleed}" y="${bleed}" width="${width - bleed * 2}" height="${height - bleed * 2}" 
            rx="20" ry="20" fill="${opts.background}" stroke="${opts.strokeColor}" stroke-width="4"/>
      
      <!-- Top word background -->
      <rect x="${bleed + 4}" y="${bleed + 4}" width="${width - bleed * 2 - 8}" height="${(height - bleed * 2) / 2 - 8}" 
            rx="16" ry="16" fill="url(#${gradientId})"/>
      
      <!-- Divider -->
      <line x1="${bleed + 20}" y1="${height / 2}" x2="${width - bleed - 20}" y2="${height / 2}" 
            stroke="${opts.strokeColor}" stroke-width="4"/>
      
      <!-- Top word -->
      <text x="${width / 2}" y="${height / 4 + 20}" class="card-text">${top.word}</text>
      
      <!-- Top taboos -->
      ${top.taboos.map((taboo, i) => 
        `<text x="${width / 2}" y="${height / 4 + 70 + i * 30}" class="taboo-text">• ${taboo}</text>`
      ).join('\n      ')}
      
      <!-- Bottom word -->
      <text x="${width / 2}" y="${height * 3 / 4 + 20}" class="card-text">${bottom.word}</text>
      
      <!-- Bottom taboos -->
      ${bottom.taboos.map((taboo, i) => 
        `<text x="${width / 2}" y="${height * 3 / 4 + 70 + i * 30}" class="taboo-text">• ${taboo}</text>`
      ).join('\n      ')}
      
      <!-- Category label -->
      ${opts.category ? `
        <text x="${width - 60}" y="${height - 30}" class="category-text">${opts.category}</text>
      ` : ''}
    </svg>
  `
  
  return svg.trim()
}

export function generateMultipleSVGs(cards: TabooCard[], options: Partial<CardGenerationOptions> = {}): string[] {
  return cards.map(card => generateSVG(card, options))
}
