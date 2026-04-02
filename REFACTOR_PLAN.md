# Techie Taboo Refactoring Plan

## Overview

Transform the messy vanilla HTML/JS master branch into a modern, well-organized React + Vite + shadcn/ui application with proper testing and component architecture.

## Current State Analysis

### Master Branch Issues

- **Multiple HTML files** (index.html, about.html, book.html, manufacturer.html, etc.) with duplicated code
- **Inline styles** mixed with external CSS
- **No component structure** - everything is procedural JavaScript
- **Complex export functionality** spread across multiple files (exporters.js, print.js, etc.)
- **No testing framework**
- **Messy file organization** in public/scripts/ with 31+ files
- **Font management issues** - fonts scattered across multiple locations

### Refactor Branch Progress

✅ **Completed:**

- Vite + React + TypeScript setup
- shadcn/ui configuration
- Basic Navigation component
- Manufacturer page structure
- Tailwind CSS integration

## Refactoring Strategy

### Phase 1: Foundation & Testing Setup

**Goal:** Establish solid foundation with testing infrastructure

1. **Setup Testing Framework**

   ```bash
   npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
   npm install -D @playwright/test
   ```

   - Configure Vitest for unit tests
   - Configure Playwright for integration tests
   - Setup test scripts in package.json

2. **Create Core Type Definitions**
   - `src/types/taboo.ts` - TabooCard, Category, etc.
   - `src/types/export.ts` - Export formats and options
   - `src/types/ui.ts` - UI component props

3. **Establish File Structure**
   ```
   src/
   ├── components/
   │   ├── ui/          # shadcn components
   │   ├── features/    # Feature-specific components
   │   └── layout/      # Layout components
   ├── pages/           # Page components
   ├── hooks/           # Custom React hooks
   ├── lib/             # Utility functions
   ├── services/        # API/business logic
   ├── stores/          # State management
   └── types/           # TypeScript definitions
   ```

### Phase 2: Core Business Logic Migration

**Goal:** Extract and test core business logic from vanilla JS

1. **Data Layer Migration**
   - Migrate `public/scripts/data/` → `src/lib/data/`
   - Convert to TypeScript modules
   - Add data validation with Zod
   - Unit tests for data structures

2. **Category System**
   - Extract category logic from `public/scripts/lib/categories.js`
   - Create `src/services/categoryService.ts`
   - Add tests for category detection and color mapping

3. **SVG Generation**
   - Migrate `public/scripts/lib/generateSVG.js` → React component
   - Create `src/components/features/CardGenerator.tsx`
   - Add visual regression tests

### Phase 3: Page-by-Page Migration

**Goal:** Convert each HTML page to React component with tests

1. **Card Generator Page** (Priority: High)
   - Migrate `public/index.html` → `src/pages/CardGenerator.tsx`
   - Component breakdown:
     - `CardGenerator` - Main page component
     - `CardForm` - Input form for custom cards
     - `CardPreview` - Live preview component
     - `CardList` - Generated cards display
   - Tests: Unit tests for each component, integration tests for workflow

2. **Book Page** (Priority: Medium)
   - Migrate `public/book.html` → `src/pages/Book.tsx`
   - Create book generation components
   - Add pagination and filtering

3. **About Page** (Priority: Low)
   - Migrate `public/about.html` → `src/pages/About.tsx`
   - Static content with shadcn components

4. **System Pages** (Priority: Low)
   - Migrate system.html, system-print.html
   - Consolidate into single page with mode toggle

### Phase 4: Export System Refactoring

**Goal:** Rebuild export functionality with modern patterns

1. **Export Service**
   - Create `src/services/exportService.ts`
   - Abstract export logic into clean interfaces
   - Support for multiple formats (SVG, PNG, PDF)

2. **Export Components**
   - `ExportModal` - Unified export interface
   - `ExportProgress` - Progress tracking
   - `ExportHistory` - Previous exports

3. **Export Testing**
   - Mock canvas API for unit tests
   - Integration tests with Playwright
   - File output validation

### Phase 5: Advanced Features & Polish

**Goal:** Add missing features and improve UX

1. **State Management**
   - Implement Zustand or Jotai for global state
   - Persist user preferences
   - Add undo/redo functionality

2. **Performance Optimization**
   - Lazy loading for heavy components
   - Virtual scrolling for large card lists
   - Memoization for expensive operations

3. **Accessibility**
   - ARIA labels and roles
   - Keyboard navigation
   - Screen reader support
   - High contrast mode

4. **Internationalization**
   - Add react-i18next
   - Extract all text strings
   - Add language switcher

## Testing Strategy

### Unit Tests (Vitest)

- **Coverage Goal:** 90%+
- **Focus:** Business logic, utilities, pure functions
- **Example:**
  ```typescript
  test("should detect correct category from keywords", () => {
    expect(detectCategory("React hooks")).toBe("Frontend");
    expect(detectCategory("Docker containers")).toBe("DevOps");
  });
  ```

### Integration Tests (Playwright)

- **Coverage Goal:** All user workflows
- **Focus:** Page interactions, export flows, navigation
- **Example:**
  ```typescript
  test("card generation workflow", async ({ page }) => {
    await page.goto("/");
    await page.fill('[data-testid="word-input"]', "React");
    await page.click('[data-testid="generate-btn"]');
    await expect(page.locator('[data-testid="card-preview"]')).toBeVisible();
  });
  ```

### Visual Regression Tests

- **Coverage Goal:** All UI components
- **Tool:** Playwright with screenshots
- **Trigger:** On PR, before merge

## Migration Checklist

### Pre-Migration

- [ ] Backup master branch
- [ ] Create feature branches for each phase
- [ ] Setup CI/CD pipeline
- [ ] Configure code quality tools (ESLint, Prettier)

### During Migration

- [ ] Write tests BEFORE refactoring code
- [ ] Migrate one feature at a time
- [ ] Keep master branch deployable
- [ ] Document breaking changes

### Post-Migration

- [ ] Performance audit (Lighthouse)
- [ ] Security audit
- [ ] User acceptance testing
- [ ] Migration guide for users

## Success Metrics

1. **Code Quality**
   - 90%+ test coverage
   - 0 TypeScript errors
   - ESLint score: 10/10

2. **Performance**
   - Lighthouse score: 90+
   - Bundle size: <500KB (gzipped)
   - First Contentful Paint: <1.5s

3. **Developer Experience**
   - Hot reload working
   - Clear error messages
   - Comprehensive documentation

4. **User Experience**
   - All features working
   - Mobile responsive
   - Accessible (WCAG 2.1 AA)

## Risks & Mitigations

| Risk                        | Impact | Mitigation                               |
| --------------------------- | ------ | ---------------------------------------- |
| Export functionality breaks | High   | Comprehensive testing, gradual migration |
| Performance regression      | Medium | Bundle analysis, lazy loading            |
| Lost features               | High   | Feature audit, user feedback             |
| Browser compatibility       | Medium | Cross-browser testing, polyfills         |

## Timeline Estimate

- **Phase 1:** 2-3 days (Foundation)
- **Phase 2:** 3-4 days (Core Logic)
- **Phase 3:** 5-7 days (Pages)
- **Phase 4:** 4-5 days (Export System)
- **Phase 5:** 3-4 days (Polish)

**Total:** 17-23 days

## Next Steps

1. Commit current refactor branch progress
2. Create feature branch for Phase 1
3. Setup testing infrastructure
4. Begin with data layer migration

---

_This plan should be updated as we discover new information during the refactoring process._
