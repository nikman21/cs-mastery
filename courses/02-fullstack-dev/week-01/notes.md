# Week 1: Modern React + TypeScript

**Duration:** August 15-21  
**Goal:** Master React with TypeScript and build a component library

---

## 🎯 Learning Objectives

By end of this week, you should be able to:
- [ ] Write React components with TypeScript generics
- [ ] Implement custom hooks with proper typing
- [ ] Apply performance optimization techniques
- [ ] Build reusable and composable components
- [ ] Test React components effectively
- [ ] Set up modern React development environment

---

## 📚 Core Concepts

### 1. TypeScript in React

#### Component Props Interface
```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  onClick,
  disabled = false
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
```

#### Generic Components
```tsx
interface DataListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
}

function DataList<T>({
  items,
  renderItem,
  keyExtractor,
  emptyMessage = 'No items found'
}: DataListProps<T>) {
  if (items.length === 0) {
    return <div className="empty-state">{emptyMessage}</div>;
  }

  return (
    <div className="data-list">
      {items.map((item, index) => (
        <div key={keyExtractor(item)} className="data-list-item">
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}
```

### 2. Custom Hooks

#### Data Fetching Hook
```tsx
interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetch<T>(url: string): FetchState<T> & { refetch: () => void } {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}
```

#### Local Storage Hook
```tsx
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}
```

#### Debounce Hook
```tsx
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Usage example
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const { data, loading } = useFetch<SearchResult[]>(
    `/api/search?q=${debouncedSearchTerm}`
  );

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      {loading && <div>Searching...</div>}
      {data && <SearchResults results={data} />}
    </div>
  );
}
```

### 3. Performance Optimization

#### React.memo
```tsx
interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
}

const UserCard = React.memo<UserCardProps>(({ user, onEdit }) => {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={() => onEdit(user)}>Edit</button>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function (optional)
  return prevProps.user.id === nextProps.user.id &&
         prevProps.user.name === nextProps.user.name;
});
```

#### useMemo for Expensive Calculations
```tsx
function DataTable<T>({ data, searchTerm, sortField }: DataTableProps<T>) {
  const processedData = useMemo(() => {
    let filtered = data;
    
    // Filter data
    if (searchTerm) {
      filtered = data.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    // Sort data
    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      });
    }
    
    return filtered;
  }, [data, searchTerm, sortField]);

  return (
    <div className="data-table">
      {processedData.map((item, index) => (
        <div key={index}>{/* render item */}</div>
      ))}
    </div>
  );
}
```

#### useCallback for Event Handlers
```tsx
function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  const handleToggle = useCallback((id: string) => {
    onToggle(id);
  }, [onToggle]);

  const handleDelete = useCallback((id: string) => {
    onDelete(id);
  }, [onDelete]);

  return (
    <div>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
```

### 4. Component Design Patterns

#### Compound Components
```tsx
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function Tabs({ defaultTab, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }: TabListProps) {
  return <div className="tab-list" role="tablist">{children}</div>;
}

function Tab({ value, children }: TabProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tab must be used within Tabs');

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;

  return (
    <button
      className={`tab ${isActive ? 'active' : ''}`}
      onClick={() => setActiveTab(value)}
      role="tab"
      aria-selected={isActive}
    >
      {children}
    </button>
  );
}

function TabPanels({ children }: TabPanelsProps) {
  return <div className="tab-panels">{children}</div>;
}

function TabPanel({ value, children }: TabPanelProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabPanel must be used within Tabs');

  const { activeTab } = context;
  if (activeTab !== value) return null;

  return (
    <div className="tab-panel" role="tabpanel">
      {children}
    </div>
  );
}

// Compound export
Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panels = TabPanels;
Tabs.Panel = TabPanel;

// Usage
function App() {
  return (
    <Tabs defaultTab="tab1">
      <Tabs.List>
        <Tabs.Tab value="tab1">Tab 1</Tabs.Tab>
        <Tabs.Tab value="tab2">Tab 2</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panels>
        <Tabs.Panel value="tab1">Content 1</Tabs.Panel>
        <Tabs.Panel value="tab2">Content 2</Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  );
}
```

#### Render Props Pattern
```tsx
interface RenderPropsDataFetcherProps<T> {
  url: string;
  children: (state: FetchState<T> & { refetch: () => void }) => React.ReactNode;
}

function DataFetcher<T>({ url, children }: RenderPropsDataFetcherProps<T>) {
  const fetchState = useFetch<T>(url);
  return <>{children(fetchState)}</>;
}

// Usage
function UserProfile({ userId }: { userId: string }) {
  return (
    <DataFetcher<User> url={`/api/users/${userId}`}>
      {({ data: user, loading, error, refetch }) => {
        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error: {error}</div>;
        if (!user) return <div>User not found</div>;

        return (
          <div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
            <button onClick={refetch}>Refresh</button>
          </div>
        );
      }}
    </DataFetcher>
  );
}
```

### 5. Testing React Components

#### Basic Component Testing
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button Component', () => {
  test('renders correctly with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  test('applies correct variant class', () => {
    render(<Button variant="danger">Delete</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-danger');
  });

  test('handles click events', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

#### Hook Testing
```tsx
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('initializes with default value', () => {
    const { result } = renderHook(() => useLocalStorage('test', 'default'));
    expect(result.current[0]).toBe('default');
  });

  test('updates value and localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test', 'initial'));
    
    act(() => {
      result.current[1]('updated');
    });
    
    expect(result.current[0]).toBe('updated');
    expect(localStorage.getItem('test')).toBe('"updated"');
  });

  test('handles localStorage errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    // Mock localStorage.setItem to throw
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('Storage full');
      });

    const { result } = renderHook(() => useLocalStorage('test', 'initial'));
    
    act(() => {
      result.current[1]('updated');
    });
    
    expect(consoleSpy).toHaveBeenCalled();
    setItemSpy.mockRestore();
    consoleSpy.mockRestore();
  });
});
```

---

## 🛠️ Development Tools

### Modern React Tooling
```bash
# Create new React + TypeScript project
npm create vite@latest my-app -- --template react-ts

# Essential dependencies
npm install @types/react @types/react-dom

# Development dependencies
npm install -D @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event vitest jsdom
npm install -D eslint @typescript-eslint/eslint-plugin
npm install -D prettier eslint-config-prettier
```

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",
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
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### ESLint Configuration
```json
{
  "extends": [
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

---

## 📝 Study Plan

### Day 1-2: TypeScript Setup & Basic Components
- Set up React + TypeScript project
- Learn component prop interfaces
- Implement basic Button component
- Study examples in `examples/basic-components.tsx`

### Day 3-4: Generic Components & Custom Hooks
- Build generic DataTable component
- Implement useFetch and useLocalStorage hooks
- Practice TypeScript generics
- Study examples in `examples/generic-components.tsx`

### Day 5-6: Performance Optimization
- Apply React.memo, useMemo, useCallback
- Implement performance monitoring
- Study examples in `examples/performance-optimization.tsx`

### Day 7: Testing & Documentation
- Write comprehensive test suite
- Set up Storybook (optional)
- Performance analysis and optimization

---

## 🔍 Key Questions to Master

1. **When should you use React.memo vs useMemo vs useCallback?**
2. **How do TypeScript generics work with React components?**
3. **What are the different ways to type event handlers in React?**
4. **How do you properly test custom hooks?**
5. **What are the tradeoffs between different component patterns?**
6. **How do you optimize React components for large datasets?**

---

## 🎯 Week Assessment

### Knowledge Check
- [ ] Can write TypeScript interfaces for React components
- [ ] Understands when and how to use React performance optimizations
- [ ] Can implement custom hooks with proper typing
- [ ] Knows how to test React components effectively

### Practical Skills
- [ ] Built working component library
- [ ] Implemented performance optimizations
- [ ] Written comprehensive test suite
- [ ] Applied TypeScript generics correctly

---

## 📊 Next Week Preview

**Week 2: React Performance & Patterns**
- Advanced performance optimization techniques
- Virtualization for large datasets
- Code splitting and lazy loading
- Advanced component patterns

*Focus: Master React performance and advanced patterns*

---

*Last updated: [Date]* 