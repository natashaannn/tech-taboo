import { describe, it, expect } from 'vitest'
import { detectCategory, getCategoryColor, getCategoryTextColor } from '../categories'

describe('categories', () => {
  describe('detectCategory', () => {
    it('should detect Frontend category correctly', () => {
      expect(detectCategory('React')).toBe('Frontend')
      expect(detectCategory('CSS')).toBe('Frontend')
      expect(detectCategory('JavaScript')).toBe('Frontend')
      expect(detectCategory('Vue.js')).toBe('Frontend')
    })

    it('should detect Backend category correctly', () => {
      expect(detectCategory('Node.js')).toBe('Backend')
      expect(detectCategory('Database')).toBe('Backend')
      expect(detectCategory('API')).toBe('Backend')
      expect(detectCategory('Express')).toBe('Backend')
    })

    it('should detect DevOps category correctly', () => {
      expect(detectCategory('Docker')).toBe('DevOps')
      expect(detectCategory('Kubernetes')).toBe('DevOps')
      expect(detectCategory('AWS')).toBe('DevOps')
      expect(detectCategory('CI/CD')).toBe('DevOps')
    })

    it('should detect Mobile category correctly', () => {
      expect(detectCategory('React Native')).toBe('Mobile')
      expect(detectCategory('Flutter')).toBe('Mobile')
      expect(detectCategory('Swift')).toBe('Mobile')
      expect(detectCategory('Kotlin')).toBe('Mobile')
    })

    it('should return General for unknown words', () => {
      expect(detectCategory('Unknown')).toBe('General')
      expect(detectCategory('Random')).toBe('General')
      expect(detectCategory('Banana')).toBe('General')
    })
  })

  describe('getCategoryColor', () => {
    it('should return correct colors for each category', () => {
      expect(getCategoryColor('Frontend')).toBe('#61DAFB')
      expect(getCategoryColor('Backend')).toBe('#68217A')
      expect(getCategoryColor('DevOps')).toBe('#2496ED')
      expect(getCategoryColor('Mobile')).toBe('#A4C639')
      expect(getCategoryColor('General')).toBe('#FF6B6B')
    })

    it('should return General color for unknown category', () => {
      expect(getCategoryColor('Unknown')).toBe('#FF6B6B')
    })
  })

  describe('getCategoryTextColor', () => {
    it('should return correct text colors for each category', () => {
      expect(getCategoryTextColor('Frontend')).toBe('#000000')
      expect(getCategoryTextColor('Backend')).toBe('#FFFFFF')
      expect(getCategoryTextColor('DevOps')).toBe('#FFFFFF')
      expect(getCategoryTextColor('Mobile')).toBe('#000000')
      expect(getCategoryTextColor('General')).toBe('#FFFFFF')
    })

    it('should return General text color for unknown category', () => {
      expect(getCategoryTextColor('Unknown')).toBe('#FFFFFF')
    })
  })
})
