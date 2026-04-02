import { describe, it, expect } from 'vitest'
import { generateSVG } from '../generateSVG'
import type { TabooCard } from '../../types/taboo'

describe('generateSVG', () => {
  const mockCard: TabooCard = {
    id: 'test-card-1',
    top: { index: 1, word: 'React', taboo: ['JavaScript', 'Library', 'Facebook', 'Components', 'Virtual DOM'], explanation: 'A JavaScript library' },
    bottom: { index: 2, word: 'State', taboo: ['Data', 'Management', 'useState', 'Redux', 'Props'], explanation: 'Component data' },
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
      top: { index: 1, word: 'Test', taboo: [], explanation: '' },
      bottom: { index: 2, word: 'Empty', taboo: [], explanation: '' },
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
      top: { index: 1, word: 'HTML & CSS', taboo: ['<script>', 'CSS>'], explanation: '' },
      bottom: { index: 2, word: 'JS "Quotes"', taboo: ["'single'", '"double"'], explanation: '' },
      createdAt: new Date()
    }
    
    const svg = generateSVG(specialCard)
    expect(svg).toContain('HTML &')
    expect(svg).toContain('CSS')
    expect(svg).toContain('JS "Quotes"')
  })
})
