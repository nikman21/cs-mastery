# Week 1 Assignment: TypeScript Component Library

**Due:** End of Week 1  
**Difficulty:** Intermediate  
**Estimated Time:** 12-15 hours

---

## 🎯 Assignment Overview

Build a modern React component library using TypeScript generics, custom hooks, and performance optimization techniques. This project will establish your foundation for building scalable, type-safe React applications.

## 📁 Project Structure

```
week-01-component-library/
├── README.md                 # This file
├── package.json              # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
├── vitest.config.ts         # Test configuration
├── src/
│   ├── components/          # Component implementations (YOUR WORK HERE)
│   │   ├── Button.tsx
│   │   ├── DataTable.tsx
│   │   └── index.ts
│   ├── hooks/               # Custom hooks (YOUR WORK HERE)
│   │   ├── useFetch.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   └── index.ts
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── styles/              # Global styles and theme
│   │   └── globals.css
│   ├── App.tsx              # Demo application
│   ├── main.tsx             # Entry point
│   └── vite-env.d.ts        # Vite type definitions
├── tests/                   # Test files
│   ├── components/
│   └── hooks/
└── dist/                    # Build output (generated)
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# Navigate to the assignment directory
cd projects/mini-projects/02-fullstack-dev/week-01-component-library

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Your Task

**Look for TODO comments in the source files** - these mark the areas you need to implement:

1. **`Button.tsx`** - Implement a reusable button component with variants
2. **`DataTable.tsx`** - Build a generic data table with TypeScript
3. **`useFetch.ts`** - Create a data fetching hook
4. **`useLocalStorage.ts`** - Implement local storage hook
5. **`useDebounce.ts`** - Build a debounce hook

## 📋 Core Requirements

### Must Implement ✅
- [ ] **Button Component** - Variants (primary, secondary, danger), sizes (small, medium, large)
- [ ] **Generic DataTable** - Sortable columns, custom renderers, loading states
- [ ] **useFetch Hook** - Data fetching with loading, error, and success states
- [ ] **useLocalStorage Hook** - Persistent state management
- [ ] **useDebounce Hook** - Performance optimization for search/input

### Pass All Tests ✅
- [ ] Component functionality tests
- [ ] Hook behavior tests
- [ ] TypeScript type checking
- [ ] Performance optimization tests
- [ ] Integration tests

## 🧪 Testing Your Implementation

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Type checking
npm run type-check

# Linting
npm run lint
```

**Expected Output:**
```
Component Library Test Suite
============================
Running tests for your Week 1 assignment...

✓ Button component renders correctly
✓ Button handles click events
✓ DataTable displays data properly
✓ DataTable sorting works
✓ useFetch hook fetches data
✓ useLocalStorage persists state
✓ useDebounce delays execution

All tests passed! 🎉
```

## 🔧 Development Tips

### TypeScript Best Practices
- Use proper generic constraints: `T extends Record<string, any>`
- Define clear interfaces for all props
- Avoid using `any` - use proper typing
- Leverage utility types like `Partial<T>`, `Pick<T, K>`, etc.

### Performance Optimization
- Use `React.memo` for expensive components
- Implement `useMemo` for expensive calculations
- Use `useCallback` for event handlers passed to children
- Consider virtualization for large datasets

### Testing Strategy
- Test component behavior, not implementation details
- Mock external dependencies (APIs, localStorage)
- Test edge cases and error states
- Write integration tests for complex interactions

## 📊 Implementation Guide

### 1. Button Component
```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  loading?: boolean;
}

// TODO: Implement the Button component
export const Button: React.FC<ButtonProps> = (props) => {
  // Your implementation here
};
```

### 2. Generic DataTable
```tsx
interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  loading?: boolean;
}

// TODO: Implement the generic DataTable component
export function DataTable<T extends Record<string, any>>(props: DataTableProps<T>) {
  // Your implementation here
}
```

### 3. Custom Hooks
```tsx
// TODO: Implement useFetch hook
export function useFetch<T>(url: string) {
  // Return { data, loading, error, refetch }
}

// TODO: Implement useLocalStorage hook
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Return [value, setValue]
}

// TODO: Implement useDebounce hook
export function useDebounce<T>(value: T, delay: number): T {
  // Return debounced value
}
```

## 🎯 Performance Goals

Your implementation should:
- **Type Safety**: All components and hooks properly typed
- **Reusability**: Components work with different data types
- **Performance**: Optimized for large datasets and frequent updates
- **Accessibility**: Basic ARIA attributes and keyboard navigation
- **Testing**: >80% test coverage

## 📚 Key Learning Objectives

After completing this assignment, you will understand:
- ✅ TypeScript generics in React components
- ✅ Custom hook development patterns
- ✅ React performance optimization techniques
- ✅ Component testing with React Testing Library
- ✅ Modern React development workflow

## 💡 Helpful Resources

- [React Docs](https://react.dev/) - Official React documentation
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - TypeScript guide
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) - Testing utilities
- [Vite Docs](https://vitejs.dev/) - Build tool documentation

## 🚨 Assignment Rules

- **DO NOT modify** the test files
- **Implement only** the TODO sections in source files
- **All tests must pass** for full credit
- **Follow TypeScript best practices**
- **Focus on code quality and performance**

## 🎓 Bonus Challenges (Optional)

- [ ] Add Storybook documentation
- [ ] Implement theming system
- [ ] Add more complex form components
- [ ] Create loading skeleton components
- [ ] Add keyboard navigation support

---

**Good luck building your component library!** 🚀

*This assignment builds the foundation for modern React development with TypeScript, setting you up for success in building scalable frontend applications.* 