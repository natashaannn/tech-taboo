import { describe, it, expect } from 'vitest'
import { detectCategory, getCategoryColor, getCategoryTextColor } from '../categories'

describe('categories', () => {
  describe('detectCategory', () => {
    it('should detect AI category correctly', () => {
      expect(detectCategory('Artificial Intelligence')).toBe('AI')
      expect(detectCategory('Machine Learning')).toBe('AI')
      expect(detectCategory('Neural Network')).toBe('AI')
      expect(detectCategory('ChatGPT')).toBe('AI')
    })

    it('should detect Software Engineering category correctly', () => {
      expect(detectCategory('Code')).toBe('Software Engineering')
      expect(detectCategory('Programming')).toBe('Software Engineering')
      expect(detectCategory('Debugging')).toBe('Software Engineering')
      expect(detectCategory('Refactoring')).toBe('Software Engineering')
    })

    it('should detect DevOps category correctly', () => {
      expect(detectCategory('Docker')).toBe('DevOps')
      expect(detectCategory('Kubernetes')).toBe('DevOps')
      expect(detectCategory('AWS')).toBe('DevOps')
      expect(detectCategory('CI/CD')).toBe('DevOps')
    })

    it('should detect Data category correctly', () => {
      expect(detectCategory('Database')).toBe('Data')
      expect(detectCategory('Analytics')).toBe('Data')
      expect(detectCategory('Big Data')).toBe('Data')
      expect(detectCategory('Data Science')).toBe('Data')
    })

    it('should return General for unknown words', () => {
      expect(detectCategory('Unknown')).toBe('General')
      expect(detectCategory('Random')).toBe('General')
      expect(detectCategory('Banana')).toBe('General')
    })
  })

  describe('getCategoryColor', () => {
    it('should return correct colors for each category', () => {
      expect(getCategoryColor('General')).toBe('#FF6B6B')
      expect(getCategoryColor('AI')).toBe('#8B5CF6')
      expect(getCategoryColor('Software Engineering')).toBe('#3B82F6')
      expect(getCategoryColor('Data')).toBe('#10B981')
      expect(getCategoryColor('DevOps')).toBe('#2496ED')
    })

    it('should return General color for unknown category', () => {
      expect(getCategoryColor('Unknown')).toBe('#FF6B6B')
    })

    it('should return correct text colors for each category', () => {
      expect(getCategoryTextColor('General')).toBe('#FFFFFF')
      expect(getCategoryTextColor('AI')).toBe('#FFFFFF')
      expect(getCategoryTextColor('Software Engineering')).toBe('#FFFFFF')
      expect(getCategoryTextColor('Data')).toBe('#FFFFFF')
      expect(getCategoryTextColor('DevOps')).toBe('#FFFFFF')
    })

    it('should return General text color for unknown category', () => {
      expect(getCategoryTextColor('Unknown')).toBe('#FFFFFF')
    })
  })

  describe('getCategoryTextColor', () => {
    it('should return correct text colors for each category', () => {
      expect(getCategoryTextColor('General')).toBe('#FFFFFF')
      expect(getCategoryTextColor('AI')).toBe('#FFFFFF')
      expect(getCategoryTextColor('Software Engineering')).toBe('#FFFFFF')
      expect(getCategoryTextColor('Data')).toBe('#FFFFFF')
      expect(getCategoryTextColor('DevOps')).toBe('#FFFFFF')
    })

    it('should return General text color for unknown category', () => {
      expect(getCategoryTextColor('Unknown')).toBe('#FFFFFF')
    })
  })
})
