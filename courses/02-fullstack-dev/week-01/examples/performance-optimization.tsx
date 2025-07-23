// Week 1 Examples: React Performance Optimization
// This file demonstrates various React performance optimization techniques

import React, { 
  useState, 
  useMemo, 
  useCallback, 
  memo, 
  useRef, 
  useEffect,
  createContext,
  useContext
} from 'react';

// =============================================================================
// 1. React.memo FOR COMPONENT MEMOIZATION
// =============================================================================

interface ExpensiveComponentProps {
  count: number;
  title: string;
  onIncrement: () => void;
}

// Without memo - re-renders on every parent render
const ExpensiveComponentBad: React.FC<ExpensiveComponentProps> = ({ 
  count, 
  title, 
  onIncrement 
}) => {
  // Simulate expensive computation
  const expensiveValue = (() => {
    console.log('🔴 Expensive calculation running...');
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.random();
    }
    return result;
  })();

  return (
    <div className="expensive-component">
      <h3>{title}</h3>
      <p>Count: {count}</p>
      <p>Expensive Value: {expensiveValue.toFixed(2)}</p>
      <button onClick={onIncrement}>Increment</button>
    </div>
  );
};

// With memo - only re-renders when props change
const ExpensiveComponentGood = memo<ExpensiveComponentProps>(({ 
  count, 
  title, 
  onIncrement 
}) => {
  // Simulate expensive computation
  const expensiveValue = (() => {
    console.log('🟢 Expensive calculation running (memoized)...');
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.random();
    }
    return result;
  })();

  return (
    <div className="expensive-component">
      <h3>{title}</h3>
      <p>Count: {count}</p>
      <p>Expensive Value: {expensiveValue.toFixed(2)}</p>
      <button onClick={onIncrement}>Increment</button>
    </div>
  );
});

// Custom comparison function for memo
const ExpensiveComponentWithCustomComparison = memo<ExpensiveComponentProps>(
  ({ count, title, onIncrement }) => {
    console.log('🟡 Component with custom comparison rendering...');
    
    return (
      <div className="expensive-component">
        <h3>{title}</h3>
        <p>Count: {count}</p>
        <button onClick={onIncrement}>Increment</button>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if count changes (ignore title and function changes)
    return prevProps.count === nextProps.count;
  }
);

// =============================================================================
// 2. useMemo FOR EXPENSIVE CALCULATIONS
// =============================================================================

interface User {
  id: number;
  name: string;
  age: number;
  salary: number;
  department: string;
  isActive: boolean;
}

interface DataProcessorProps {
  users: User[];
  searchTerm: string;
  sortField: keyof User;
  filterDepartment: string;
}

const DataProcessor: React.FC<DataProcessorProps> = ({
  users,
  searchTerm,
  sortField,
  filterDepartment
}) => {
  // ❌ BAD: Expensive calculation runs on every render
  const processedDataBad = users
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = !filterDepartment || user.department === filterDepartment;
      return matchesSearch && matchesDepartment && user.isActive;
    })
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    });

  // ✅ GOOD: Expensive calculation only runs when dependencies change
  const processedDataGood = useMemo(() => {
    console.log('🟢 Processing data with useMemo...');
    
    return users
      .filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDepartment = !filterDepartment || user.department === filterDepartment;
        return matchesSearch && matchesDepartment && user.isActive;
      })
      .sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      });
  }, [users, searchTerm, sortField, filterDepartment]);

  // Complex statistical calculations
  const statistics = useMemo(() => {
    console.log('🟢 Calculating statistics...');
    
    if (processedDataGood.length === 0) {
      return { avgSalary: 0, totalUsers: 0, departmentCount: 0 };
    }

    const avgSalary = processedDataGood.reduce((sum, user) => sum + user.salary, 0) / processedDataGood.length;
    const departmentCount = new Set(processedDataGood.map(user => user.department)).size;

    return {
      avgSalary: Math.round(avgSalary),
      totalUsers: processedDataGood.length,
      departmentCount
    };
  }, [processedDataGood]);

  return (
    <div className="data-processor">
      <div className="statistics">
        <h3>Statistics</h3>
        <p>Total Users: {statistics.totalUsers}</p>
        <p>Average Salary: ${statistics.avgSalary.toLocaleString()}</p>
        <p>Departments: {statistics.departmentCount}</p>
      </div>
      
      <div className="user-list">
        {processedDataGood.map(user => (
          <div key={user.id} className="user-card">
            <h4>{user.name}</h4>
            <p>{user.department} - ${user.salary.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// 3. useCallback FOR FUNCTION MEMOIZATION
// =============================================================================

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoListProps {
  todos: TodoItem[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

// Child component that will be memoized
const TodoItemComponent = memo<{
  todo: TodoItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}>(({ todo, onToggle, onDelete, onEdit }) => {
  console.log(`🟢 Rendering todo item: ${todo.text}`);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSave = () => {
    onEdit(todo.id, editText);
    setIsEditing(false);
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      
      {isEditing ? (
        <div className="edit-mode">
          <input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSave}
            onKeyPress={(e) => e.key === 'Enter' && handleSave()}
          />
        </div>
      ) : (
        <span 
          className="todo-text"
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.text}
        </span>
      )}
      
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </div>
  );
});

const TodoList: React.FC<TodoListProps> = ({ todos, onToggle, onDelete, onEdit }) => {
  // ❌ BAD: New functions created on every render
  const handleToggleBad = (id: string) => onToggle(id);
  const handleDeleteBad = (id: string) => onDelete(id);
  const handleEditBad = (id: string, newText: string) => onEdit(id, newText);

  // ✅ GOOD: Functions memoized with useCallback
  const handleToggleGood = useCallback((id: string) => {
    onToggle(id);
  }, [onToggle]);

  const handleDeleteGood = useCallback((id: string) => {
    onDelete(id);
  }, [onDelete]);

  const handleEditGood = useCallback((id: string, newText: string) => {
    onEdit(id, newText);
  }, [onEdit]);

  return (
    <div className="todo-list">
      {todos.map(todo => (
        <TodoItemComponent
          key={todo.id}
          todo={todo}
          onToggle={handleToggleGood}
          onDelete={handleDeleteGood}
          onEdit={handleEditGood}
        />
      ))}
    </div>
  );
};

// =============================================================================
// 4. PREVENTING UNNECESSARY RE-RENDERS WITH CONTEXT
// =============================================================================

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

interface UserContextType {
  user: { id: number; name: string } | null;
  setUser: (user: { id: number; name: string } | null) => void;
}

// Separate contexts to avoid unnecessary re-renders
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const UserContext = createContext<UserContextType | undefined>(undefined);

// Theme provider that doesn't change often
const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const value = useMemo(() => ({
    theme,
    toggleTheme
  }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// User provider that might change more frequently
const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: number; name: string } | null>(null);

  const value = useMemo(() => ({
    user,
    setUser
  }), [user]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Components that only subscribe to what they need
const ThemeToggle = memo(() => {
  const themeContext = useContext(ThemeContext);
  
  if (!themeContext) {
    throw new Error('ThemeToggle must be used within ThemeProvider');
  }

  console.log('🟢 ThemeToggle rendering');
  
  return (
    <button onClick={themeContext.toggleTheme}>
      Switch to {themeContext.theme === 'light' ? 'dark' : 'light'} mode
    </button>
  );
});

const UserProfile = memo(() => {
  const userContext = useContext(UserContext);
  
  if (!userContext) {
    throw new Error('UserProfile must be used within UserProvider');
  }

  console.log('🟢 UserProfile rendering');
  
  return (
    <div className="user-profile">
      {userContext.user ? (
        <div>
          <p>Welcome, {userContext.user.name}!</p>
          <button onClick={() => userContext.setUser(null)}>Logout</button>
        </div>
      ) : (
        <button onClick={() => userContext.setUser({ id: 1, name: 'John Doe' })}>
          Login
        </button>
      )}
    </div>
  );
});

// =============================================================================
// 5. VIRTUAL SCROLLING FOR LARGE LISTS
// =============================================================================

interface VirtualScrollProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
}

const VirtualScroll: React.FC<VirtualScrollProps> = ({
  items,
  itemHeight,
  containerHeight,
  renderItem
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  const visibleItems = useMemo(() => {
    return items.slice(visibleStart, visibleEnd);
  }, [items, visibleStart, visibleEnd]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleStart * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <div
      ref={containerRef}
      className="virtual-scroll-container"
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={visibleStart + index} style={{ height: itemHeight }}>
              {renderItem(item, visibleStart + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// 6. PERFORMANCE MONITORING HOOK
// =============================================================================

const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);
  const startTime = useRef<number>(0);

  useEffect(() => {
    renderCount.current += 1;
    startTime.current = performance.now();
    
    return () => {
      const endTime = performance.now();
      console.log(
        `🔍 ${componentName} - Render #${renderCount.current} took ${
          endTime - startTime.current
        }ms`
      );
    };
  });

  return renderCount.current;
};

// =============================================================================
// 7. DEMO COMPONENT BRINGING IT ALL TOGETHER
// =============================================================================

export const PerformanceDemo: React.FC = () => {
  const renderCount = usePerformanceMonitor('PerformanceDemo');
  
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: '1', text: 'Learn React Performance', completed: false },
    { id: '2', text: 'Master useMemo', completed: true },
    { id: '3', text: 'Understand useCallback', completed: false },
  ]);

  // Sample users data
  const users: User[] = useMemo(() => {
    return Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `User ${i}`,
      age: 20 + (i % 40),
      salary: 30000 + (i * 1000),
      department: ['Engineering', 'Marketing', 'Sales', 'HR'][i % 4],
      isActive: i % 3 !== 0
    }));
  }, []);

  // Memoized callbacks
  const handleIncrement = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  const handleTodoToggle = useCallback((id: string) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const handleTodoDelete = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  const handleTodoEdit = useCallback((id: string, newText: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  }, []);

  // Large dataset for virtual scrolling
  const largeDataset = useMemo(() => {
    return Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      text: `Item ${i}`,
      value: Math.random() * 1000
    }));
  }, []);

  return (
    <ThemeProvider>
      <UserProvider>
        <div className="performance-demo">
          <h1>React Performance Optimization Demo</h1>
          <p>Render count: {renderCount}</p>

          {/* Context Examples */}
          <section>
            <h2>Context Optimization</h2>
            <ThemeToggle />
            <UserProfile />
          </section>

          {/* Memo Examples */}
          <section>
            <h2>Component Memoization</h2>
            <div className="memo-examples">
              <ExpensiveComponentGood
                count={count}
                title="Memoized Component"
                onIncrement={handleIncrement}
              />
              
              <ExpensiveComponentWithCustomComparison
                count={count}
                title="Custom Comparison"
                onIncrement={handleIncrement}
              />
            </div>
          </section>

          {/* Data Processing */}
          <section>
            <h2>Data Processing with useMemo</h2>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <DataProcessor
              users={users}
              searchTerm={searchTerm}
              sortField="name"
              filterDepartment=""
            />
          </section>

          {/* Todo List */}
          <section>
            <h2>Todo List with useCallback</h2>
            <TodoList
              todos={todos}
              onToggle={handleTodoToggle}
              onDelete={handleTodoDelete}
              onEdit={handleTodoEdit}
            />
          </section>

          {/* Virtual Scrolling */}
          <section>
            <h2>Virtual Scrolling</h2>
            <VirtualScroll
              items={largeDataset}
              itemHeight={50}
              containerHeight={300}
              renderItem={(item, index) => (
                <div className="virtual-item">
                  <strong>{item.text}</strong> - Value: {item.value.toFixed(2)}
                </div>
              )}
            />
          </section>
        </div>
      </UserProvider>
    </ThemeProvider>
  );
};

// =============================================================================
// KEY PERFORMANCE PRINCIPLES:
//
// 1. Use React.memo for expensive components that don't change often
// 2. Use useMemo for expensive calculations that depend on specific values
// 3. Use useCallback for functions passed to child components
// 4. Split contexts to avoid unnecessary re-renders
// 5. Implement virtual scrolling for large datasets
// 6. Monitor performance with custom hooks
// 7. Only optimize when you have actual performance problems
// ============================================================================= 