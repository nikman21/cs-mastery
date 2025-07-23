// Week 1 Examples: Basic React Components with TypeScript
// This file demonstrates fundamental React + TypeScript patterns

import React, { useState, useEffect } from 'react';

// =============================================================================
// 1. BASIC COMPONENT WITH PROPS
// =============================================================================

interface GreetingProps {
  name: string;
  age?: number;
  isVip?: boolean;
}

export const Greeting: React.FC<GreetingProps> = ({ 
  name, 
  age, 
  isVip = false 
}) => {
  return (
    <div className={`greeting ${isVip ? 'vip' : ''}`}>
      <h2>Hello, {name}!</h2>
      {age && <p>You are {age} years old.</p>}
      {isVip && <span className="vip-badge">⭐ VIP</span>}
    </div>
  );
};

// =============================================================================
// 2. BUTTON COMPONENT WITH VARIANTS
// =============================================================================

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  children,
  onClick
}) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading && onClick) {
      onClick(event);
    }
  };

  return (
    <button
      className={`btn btn-${variant} btn-${size} ${loading ? 'loading' : ''}`}
      disabled={disabled || loading}
      onClick={handleClick}
    >
      {loading ? (
        <>
          <span className="spinner" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

// =============================================================================
// 3. INPUT COMPONENT WITH VALIDATION
// =============================================================================

interface InputProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'number';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="input-group">
      <label className="input-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`input ${error ? 'input-error' : ''}`}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

// =============================================================================
// 4. CARD COMPONENT WITH CHILDREN
// =============================================================================

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  actions,
  className = ''
}) => {
  return (
    <div className={`card ${className}`}>
      {(title || subtitle) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
      {actions && (
        <div className="card-actions">
          {actions}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// 5. CONDITIONAL RENDERING EXAMPLES
// =============================================================================

interface User {
  id: number;
  name: string;
  email: string;
  isOnline: boolean;
}

interface UserStatusProps {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const UserStatus: React.FC<UserStatusProps> = ({ 
  user, 
  loading, 
  error 
}) => {
  // Loading state
  if (loading) {
    return <div className="loading">Loading user...</div>;
  }

  // Error state
  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  // No user state
  if (!user) {
    return <div className="empty">No user found</div>;
  }

  // Success state
  return (
    <div className="user-status">
      <div className="user-info">
        <h4>{user.name}</h4>
        <p>{user.email}</p>
      </div>
      <div className={`status ${user.isOnline ? 'online' : 'offline'}`}>
        {user.isOnline ? '🟢 Online' : '🔴 Offline'}
      </div>
    </div>
  );
};

// =============================================================================
// 6. LIST RENDERING WITH KEYS
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
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggle,
  onDelete
}) => {
  if (todos.length === 0) {
    return <div className="empty-todos">No todos yet. Add one!</div>;
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
          />
          <span className="todo-text">{todo.text}</span>
          <button 
            className="delete-btn"
            onClick={() => onDelete(todo.id)}
          >
            ❌
          </button>
        </li>
      ))}
    </ul>
  );
};

// =============================================================================
// 7. FORM HANDLING EXAMPLE
// =============================================================================

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface ContactFormProps {
  onSubmit: (data: FormData) => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      // Reset form
      setFormData({ name: '', email: '', message: '' });
      setErrors({});
    }
  };

  const updateField = (field: keyof FormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <Input
        label="Name"
        value={formData.name}
        onChange={updateField('name')}
        error={errors.name}
        required
      />
      
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={updateField('email')}
        error={errors.email}
        required
      />
      
      <div className="input-group">
        <label className="input-label">
          Message <span className="required">*</span>
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => updateField('message')(e.target.value)}
          className={`textarea ${errors.message ? 'input-error' : ''}`}
          rows={4}
        />
        {errors.message && <span className="error-message">{errors.message}</span>}
      </div>

      <Button type="submit" variant="primary">
        Send Message
      </Button>
    </form>
  );
};

// =============================================================================
// 8. DEMO APP USING ALL COMPONENTS
// =============================================================================

export const ComponentDemo: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: '1', text: 'Learn React', completed: true },
    { id: '2', text: 'Master TypeScript', completed: false },
    { id: '3', text: 'Build awesome apps', completed: false }
  ]);

  const handleButtonClick = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUser({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        isOnline: Math.random() > 0.5
      });
      setLoading(false);
    }, 2000);
  };

  const handleTodoToggle = (id: string) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleTodoDelete = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const handleFormSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
    alert(`Thanks for your message, ${data.name}!`);
  };

  return (
    <div className="component-demo">
      <h1>React + TypeScript Component Demo</h1>
      
      <section>
        <h2>Greeting Component</h2>
        <Greeting name="React Developer" age={25} isVip />
      </section>

      <section>
        <h2>Button Components</h2>
        <div className="button-group">
          <Button variant="primary" onClick={handleButtonClick} loading={loading}>
            Load User
          </Button>
          <Button variant="secondary" size="small">Small Button</Button>
          <Button variant="danger" disabled>Disabled</Button>
        </div>
      </section>

      <section>
        <h2>User Status</h2>
        <Card title="User Information">
          <UserStatus user={user} loading={loading} error={null} />
        </Card>
      </section>

      <section>
        <h2>Todo List</h2>
        <Card title="My Todos" subtitle="Track your progress">
          <TodoList 
            todos={todos}
            onToggle={handleTodoToggle}
            onDelete={handleTodoDelete}
          />
        </Card>
      </section>

      <section>
        <h2>Contact Form</h2>
        <Card title="Get in Touch">
          <ContactForm onSubmit={handleFormSubmit} />
        </Card>
      </section>
    </div>
  );
};

// =============================================================================
// USAGE NOTES:
// 
// 1. All components use proper TypeScript interfaces
// 2. Props are destructured with default values where appropriate
// 3. Event handlers are properly typed
// 4. State management uses proper type annotations
// 5. Conditional rendering handles different states
// 6. Lists use proper key props for performance
// 7. Forms include validation and error handling
// ============================================================================= 