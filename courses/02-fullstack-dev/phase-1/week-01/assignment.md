# Week 1 Assignment: TypeScript & Next.js Todo App

**Due:** End of Week 1  
**Difficulty:** Intermediate  
**Estimated Time:** 15-20 hours

---

## 🎯 Project Overview

Build a full-featured Todo application using TypeScript and Next.js 14 with App Router. This project will establish your foundation in modern React development, type safety, and Next.js architecture.

---

## 📋 Requirements

### Core Features (Must Have)
- [ ] **TypeScript setup** with strict type checking
- [ ] **Next.js 14 App Router** with proper file structure
- [ ] **Todo CRUD operations** (Create, Read, Update, Delete)
- [ ] **Local state management** with React hooks
- [ ] **Responsive design** with Tailwind CSS
- [ ] **Form validation** with Zod schemas
- [ ] **Type-safe API routes** with proper error handling

### Advanced Features (Nice to Have)
- [ ] **Persistent storage** with localStorage or database
- [ ] **Todo categories/tags** with filtering
- [ ] **Search functionality** with debouncing
- [ ] **Dark/light theme** toggle
- [ ] **Drag and drop** reordering
- [ ] **Unit tests** with Jest and React Testing Library
- [ ] **Accessibility** features (ARIA labels, keyboard navigation)

---

## 🏗️ Implementation Milestones

### Milestone 1: Project Setup (Day 1)
```bash
# Create Next.js project with TypeScript
npx create-next-app@latest todo-app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Install additional dependencies
npm install zod @hookform/resolvers react-hook-form lucide-react
npm install -D @types/node @types/react @types/react-dom
```

**Deliverables:**
- Next.js project with TypeScript configuration
- Tailwind CSS setup with custom theme
- ESLint and Prettier configuration
- Basic project structure

### Milestone 2: Type Definitions (Day 2)
```typescript
// types/todo.ts
export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoFormData {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
}

// Validation schemas
export const todoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
});
```

**Deliverables:**
- Complete TypeScript interfaces
- Zod validation schemas
- Type-safe utility functions

### Milestone 3: Core Components (Day 3-4)
```typescript
// components/TodoItem.tsx
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

// components/TodoForm.tsx
interface TodoFormProps {
  onSubmit: (data: TodoFormData) => void;
  initialData?: Todo;
  mode: 'create' | 'edit';
}

// components/TodoList.tsx
interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}
```

**Deliverables:**
- Reusable React components
- Proper TypeScript props interfaces
- Component composition patterns

### Milestone 4: State Management (Day 5)
```typescript
// hooks/useTodos.ts
export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTodo = useCallback((todoData: TodoFormData) => {
    // Implementation
  }, []);

  const toggleTodo = useCallback((id: string) => {
    // Implementation
  }, []);

  const deleteTodo = useCallback((id: string) => {
    // Implementation
  }, []);

  const updateTodo = useCallback((id: string, data: TodoFormData) => {
    // Implementation
  }, []);

  return {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
  };
}
```

**Deliverables:**
- Custom React hooks for state management
- Proper error handling and loading states
- Optimized re-renders with useCallback/useMemo

### Milestone 5: UI/UX Implementation (Day 6-7)
**Deliverables:**
- Responsive design with Tailwind CSS
- Form validation with react-hook-form and Zod
- Loading states and error handling
- Accessibility features

---

## 🧪 Test Cases

### Component Testing
```typescript
// __tests__/TodoItem.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoItem } from '@/components/TodoItem';

describe('TodoItem', () => {
  const mockTodo: Todo = {
    id: '1',
    title: 'Test Todo',
    description: 'Test Description',
    completed: false,
    priority: 'medium',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('renders todo information correctly', () => {
    render(<TodoItem todo={mockTodo} onToggle={jest.fn()} onDelete={jest.fn()} onEdit={jest.fn()} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('calls onToggle when checkbox is clicked', () => {
    const onToggle = jest.fn();
    render(<TodoItem todo={mockTodo} onToggle={onToggle} onDelete={jest.fn()} onEdit={jest.fn()} />);
    
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledWith('1');
  });
});
```

### Form Validation Testing
```typescript
// __tests__/TodoForm.test.tsx
describe('TodoForm', () => {
  it('validates required fields', async () => {
    render(<TodoForm onSubmit={jest.fn()} mode="create" />);
    
    const submitButton = screen.getByRole('button', { name: /add todo/i });
    fireEvent.click(submitButton);
    
    expect(await screen.findByText('Title is required')).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const onSubmit = jest.fn();
    render(<TodoForm onSubmit={onSubmit} mode="create" />);
    
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'New Todo' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /add todo/i }));
    
    expect(onSubmit).toHaveBeenCalledWith({
      title: 'New Todo',
      description: '',
      priority: 'medium',
    });
  });
});
```

---

## 📁 Project Structure

```
todo-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── favicon.ico
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Checkbox.tsx
│   │   ├── TodoItem.tsx
│   │   ├── TodoList.tsx
│   │   ├── TodoForm.tsx
│   │   └── Header.tsx
│   ├── hooks/
│   │   ├── useTodos.ts
│   │   └── useLocalStorage.ts
│   ├── types/
│   │   └── todo.ts
│   ├── lib/
│   │   ├── utils.ts
│   │   └── validations.ts
│   └── styles/
│       └── components.css
├── public/
├── __tests__/
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

---

## 🔧 Build Instructions

### Development Setup
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Run type checking
npm run type-check

# Build for production
npm run build
```

### Environment Configuration
```bash
# .env.local
NEXT_PUBLIC_APP_NAME=Todo App
NEXT_PUBLIC_APP_VERSION=1.0.0
```

---

## 📊 Evaluation Criteria

### TypeScript Usage (30 points)
- [ ] Strict type checking enabled
- [ ] Proper interface definitions
- [ ] Type-safe component props
- [ ] Generic types where appropriate
- [ ] No `any` types used

### Next.js Implementation (25 points)
- [ ] App Router architecture
- [ ] Server/Client component separation
- [ ] Proper file structure
- [ ] SEO optimization
- [ ] Performance optimization

### Code Quality (20 points)
- [ ] Clean, readable code
- [ ] Proper error handling
- [ ] Component composition
- [ ] Custom hooks usage
- [ ] Accessibility features

### UI/UX (15 points)
- [ ] Responsive design
- [ ] Form validation
- [ ] Loading states
- [ ] Error states
- [ ] User feedback

### Testing (10 points)
- [ ] Component tests
- [ ] Form validation tests
- [ ] Hook tests
- [ ] Good test coverage

---

## 🎓 Learning Outcomes

After completing this assignment, you will:
- ✅ Master TypeScript fundamentals and type safety
- ✅ Understand Next.js 14 App Router architecture
- ✅ Build reusable React components with proper typing
- ✅ Implement form validation with Zod
- ✅ Create responsive UIs with Tailwind CSS
- ✅ Write testable, maintainable code

---

## 💡 Hints & Tips

### Getting Started
1. **Start with types**: Define your interfaces before writing components
2. **Use strict mode**: Enable all TypeScript strict checks
3. **Component composition**: Break down complex components into smaller pieces
4. **Custom hooks**: Extract reusable logic into custom hooks
5. **Form handling**: Use react-hook-form with Zod for type-safe forms

### Common Pitfalls
- **Type assertions**: Avoid `as` keyword, use proper typing
- **Component props**: Always define interfaces for component props
- **State management**: Use appropriate state management patterns
- **Error boundaries**: Implement proper error handling
- **Performance**: Use React.memo and useCallback where appropriate

### Best Practices
```typescript
// Good: Proper typing
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

// Good: Custom hook with proper typing
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}
```

---

*Good luck building your TypeScript Todo app!* 