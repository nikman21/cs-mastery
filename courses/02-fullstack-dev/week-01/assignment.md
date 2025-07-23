# Week 1 Assignment: TypeScript Component Library

**Due:** End of Week 1  
**Difficulty:** Intermediate  
**Estimated Time:** 12-15 hours

---

## 🎯 Project Overview

Build a modern React component library using TypeScript generics, custom hooks, and performance optimization techniques. This project will establish your foundation for building scalable, type-safe React applications.

---

## 📋 Requirements

### Core Features (Must Have)
- [ ] **Generic Button component** with variant and size system
- [ ] **Data Table component** with TypeScript generics for any data type
- [ ] **Custom hooks** for data fetching, local storage, and debouncing
- [ ] **Performance optimization** using React.memo and useMemo
- [ ] **TypeScript integration** with strict type checking and generics

### Advanced Features (Nice to Have)
- [ ] **Theme system** with CSS-in-JS or CSS variables
- [ ] **Form components** with validation and error handling
- [ ] **Loading states** and skeleton components
- [ ] **Storybook integration** for component documentation
- [ ] **Unit tests** with React Testing Library

---

## 🏗️ Implementation Milestones

### Milestone 1: Project Setup & Basic Button (Days 1-2)
```tsx
interface ButtonProps<T = HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<T>) => void;
  disabled?: boolean;
}

const Button = <T = HTMLButtonElement>({
  variant = 'primary',
  size = 'medium',
  children,
  ...props
}: ButtonProps<T>) => {
  // Implementation here
};
```

**Deliverables:**
- Vite + React + TypeScript setup
- Button component with variants
- Basic styling system

### Milestone 2: Generic Data Table (Days 3-4)
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

const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  loading
}: DataTableProps<T>) => {
  // Implementation with sorting, filtering, virtualization
};
```

**Deliverables:**
- Generic data table component
- Sorting and filtering functionality
- Performance optimization for large datasets

### Milestone 3: Custom Hooks (Days 5-6)
```tsx
// Data fetching hook
function useFetch<T>(url: string): {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Local storage hook
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void]

// Debounce hook
function useDebounce<T>(value: T, delay: number): T
```

**Deliverables:**
- Reusable custom hooks
- TypeScript generics for type safety
- Error handling and loading states

### Milestone 4: Performance & Testing (Day 7)
**Deliverables:**
- React.memo optimization
- useMemo for expensive calculations
- Comprehensive test suite
- Performance analysis

---

## 🧪 Test Cases

### Component Testing
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../components/Button';

describe('Button Component', () => {
  test('renders with correct variant classes', () => {
    render(<Button variant="primary">Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-primary');
  });

  test('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('disabled state prevents clicks', () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} disabled>
        Disabled
      </Button>
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

### Hook Testing
```tsx
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../hooks/useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('returns initial value', () => {
    const { result } = renderHook(() => 
      useLocalStorage('test-key', 'initial')
    );
    
    expect(result.current[0]).toBe('initial');
  });

  test('updates local storage', () => {
    const { result } = renderHook(() => 
      useLocalStorage('test-key', 'initial')
    );
    
    act(() => {
      result.current[1]('updated');
    });
    
    expect(result.current[0]).toBe('updated');
    expect(localStorage.getItem('test-key')).toBe(
      JSON.stringify('updated')
    );
  });
});
```

### Data Table Testing
```tsx
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

const mockUsers: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 },
];

const columns: Column<User>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email' },
  { 
    key: 'age', 
    header: 'Age', 
    render: (age) => `${age} years old`,
    sortable: true 
  },
];

describe('DataTable Component', () => {
  test('renders data correctly', () => {
    render(<DataTable data={mockUsers} columns={columns} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('25 years old')).toBeInTheDocument();
  });
});
```

---

## 📁 Project Location

**⚠️ IMPORTANT:** Your assignment code goes in the `projects/mini-projects/` folder, NOT here!

**Assignment Location:** `projects/mini-projects/02-fullstack-dev/week-01-component-library/`

```
projects/mini-projects/week-01-component-library/
├── README.md                 # Assignment instructions
├── package.json              # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
├── src/
│   ├── components/          # Component implementations (YOUR WORK)
│   │   ├── Button.tsx
│   │   ├── DataTable.tsx
│   │   └── index.ts
│   ├── hooks/               # Custom hooks (YOUR WORK)
│   │   ├── useFetch.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   └── index.ts
│   ├── types/               # TypeScript type definitions
│   ├── styles/              # Global styles and theme
│   ├── App.tsx              # Demo application
│   └── main.tsx             # Entry point
├── tests/                   # Test files
└── dist/                    # Build output
```

This folder (`courses/02-fullstack-dev/week-01/`) contains **study materials only**.

---

## 🔧 Setup Instructions

### Initial Setup
```bash
# Navigate to assignment directory
cd projects/mini-projects/week-01-component-library

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Vite Configuration
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ComponentLibrary',
      fileName: (format) => `component-library.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
})
```

---

## 📊 Evaluation Criteria

### TypeScript Usage (25 points)
- [ ] Proper generic implementations
- [ ] Strict type checking enabled
- [ ] No `any` types used
- [ ] Interface definitions for all props

### Component Design (25 points)
- [ ] Reusable and composable components
- [ ] Proper prop interfaces and defaults
- [ ] Accessibility considerations
- [ ] Clean and maintainable code

### Performance (25 points)
- [ ] React.memo implementation
- [ ] useMemo for expensive calculations
- [ ] useCallback for event handlers
- [ ] Efficient rendering patterns

### Testing & Documentation (25 points)
- [ ] Comprehensive test coverage (>80%)
- [ ] Component documentation
- [ ] Usage examples
- [ ] Performance benchmarks

---

## 🎓 Learning Outcomes

After completing this assignment, you will:
- ✅ Master TypeScript generics in React applications
- ✅ Understand React performance optimization techniques
- ✅ Know how to build reusable component libraries
- ✅ Apply testing best practices for React components
- ✅ Have experience with modern React development tools

---

## 💡 Hints & Tips

### TypeScript Best Practices
```tsx
// Use proper generic constraints
interface Props<T extends Record<string, unknown>> {
  data: T[];
  onSelect: (item: T) => void;
}

// Leverage utility types
type ButtonVariant = 'primary' | 'secondary' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

// Use proper event types
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  // Implementation
};
```

### Performance Optimization
```tsx
// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return data.filter(item => item.active).sort((a, b) => a.name.localeCompare(b.name));
}, [data]);

// Memoize callback functions
const handleItemClick = useCallback((item: Item) => {
  onItemSelect(item);
}, [onItemSelect]);

// Memoize components
const MemoizedComponent = React.memo(Component, (prevProps, nextProps) => {
  return prevProps.data === nextProps.data;
});
```

### Common Pitfalls
- **Over-optimization**: Don't memo everything, focus on actual performance bottlenecks
- **Generic constraints**: Use proper constraints for TypeScript generics
- **Props drilling**: Consider context for deeply nested components
- **Test isolation**: Mock external dependencies properly in tests

---

*Good luck with your component library implementation!* 