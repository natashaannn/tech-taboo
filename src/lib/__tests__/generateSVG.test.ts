import { describe, it, expect } from 'vitest'
import { generateSVG } from '../generateSVG'
import { TabooCard } from '@/types/taboo'

describe('generateSVG', () => {
  const mockCard: TabooCard = {
    id: 'test-card-1',
    top: { word: 'React', taboos: ['JavaScript', 'Library', 'Facebook'] },
    bottom: { word: 'State', taboos: ['Data', 'useState', 'Redux'] },
    createdAt: new Date()
  }

  it('should generate valid SVG markup', () => {
    const svg = generateSVG(mockCard)
    
    expect(svg).toContain('<svg')
    expect(svg).toContain('</svg>')
    expect(svg).toContain('React')
    expect(svg).toContain('State')
    expect(svg).toContain('JavaScript')
    expect(svg).toContain('Data')
  })

  it('should include custom options when provided', () => {
    const svg = generateSVG(mockCard, {
      baseColor: '#FF0000',
      showBleed: true,
      category: 'Frontend'
    })
    
    expect(svg).toContain('width="650"')
    expect(svg).toContain('height="950"')
    expect(svg).toContain('fill="#FF0000"')
  })

  it('should use default options when none provided', () => {
    const svg = generateSVG(mockCard)
    
    expect(svg).toContain('width="610"')
    expect(svg).toContain('height="910"')
    expect(svg).toContain('#17424A')
  })

  it('should handle empty taboo arrays', () => {
    const emptyCard: TabooCard = {
      id: 'test-empty',
      top: { word: 'Test', taboos: [] },
      bottom: { word: 'Empty', taboos: [] },
      createdAt: new Date()
    }
    
    const svg = generateSVG(emptyCard)
    expect(svg).toContain('Test')
    expect(svg).toContain('Empty')
    expect(svg.split('•').length - 1).toBe(0)
  })

  it('should handle special characters in words', () => {
    const specialCard: TabooCard = {
      id: 'test-special',
      top: { word: 'HTML & CSS', taboos: ['<script>', 'CSS>'] },
      bottom: { word: 'JS "Quotes"', taboos: ["'single'", '"double"'] },
      createdAt: new Date()
    }
    
    const svg = generateSVG(specialCard)
    expect(svg).toContain('HTML &')
    expect(svg).toContain('CSS')
    expect(svg).toContain('JS "Quotes"')
  })
})
