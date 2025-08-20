# Week 1: TypeScript & Next.js Fundamentals

**Duration:** October 15-21  
**Goal:** Master TypeScript fundamentals and Next.js 14 App Router architecture

---

## 🎯 Learning Objectives

By end of this week, you should be able to:
- [ ] Write type-safe TypeScript code with strict checking
- [ ] Understand Next.js 14 App Router architecture
- [ ] Build reusable React components with proper typing
- [ ] Implement form validation with Zod schemas
- [ ] Create responsive UIs with Tailwind CSS
- [ ] Structure Next.js applications following best practices

---

## 📚 Core Concepts

### 1. TypeScript Fundamentals

#### Basic Types
```typescript
// Primitive types
let name: string = "John";
let age: number = 25;
let isActive: boolean = true;
let hobbies: string[] = ["reading", "coding"];
let tuple: [string, number] = ["age", 25];

// Object types
interface User {
  id: number;
  name: string;
  email: string;
  isActive?: boolean; // Optional property
}

// Union types
type Status = "loading" | "success" | "error";
type ID = string | number;

// Generic types
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}
```

#### Function Types
```typescript
// Function with typed parameters and return
function add(a: number, b: number): number {
  return a + b;
}

// Arrow function with types
const multiply = (a: number, b: number): number => a * b;

// Function with optional parameters
function greet(name: string, greeting?: string): string {
  return greeting ? `${greeting}, ${name}!` : `Hello, ${name}!`;
}

// Function with rest parameters
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, num) => acc + num, 0);
}

// Function overloads
function process(value: string): string;
function process(value: number): number;
function process(value: string | number): string | number {
  return typeof value === "string" ? value.toUpperCase() : value * 2;
}
```

#### Advanced Types
```typescript
// Utility types
type PartialUser = Partial<User>; // All properties optional
type RequiredUser = Required<User>; // All properties required
type PickUser = Pick<User, "name" | "email">; // Pick specific properties
type OmitUser = Omit<User, "id">; // Exclude specific properties

// Conditional types
type NonNullable<T> = T extends null | undefined ? never : T;
type ArrayElement<T> = T extends Array<infer U> ? U : never;

// Mapped types
type ReadonlyUser = Readonly<User>; // All properties readonly
type RecordUser = Record<string, User>; // Object with string keys and User values
```

### 2. Next.js 14 App Router

#### File-Based Routing
```
app/
├── layout.tsx          # Root layout (applies to all routes)
├── page.tsx           # Home page (/)
├── about/
│   └── page.tsx       # About page (/about)
├── blog/
│   ├── page.tsx       # Blog list page (/blog)
│   └── [slug]/
│       └── page.tsx   # Dynamic blog post (/blog/post-1)
└── api/
    └── users/
        └── route.ts   # API route (/api/users)
```

#### Server vs Client Components
```typescript
// Server Component (default)
async function BlogList() {
  const posts = await fetchPosts(); // Runs on server
  
  return (
    <div>
      {posts.map(post => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}

// Client Component
"use client";

import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0); // Runs on client
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

#### Layouts and Templates
```typescript
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

// app/blog/layout.tsx
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="blog-layout">
      <BlogSidebar />
      <div className="blog-content">{children}</div>
    </div>
  );
}
```

### 3. React with TypeScript

#### Component Props
```typescript
// Basic component with typed props
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  size?: "small" | "medium" | "large";
}

function Button({ 
  children, 
  onClick, 
  variant = "primary", 
  disabled = false,
  size = "medium" 
}: ButtonProps) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} btn-${size}`}
    >
      {children}
    </button>
  );
}

// Component with generic props
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}
```

#### Hooks with TypeScript
```typescript
// Custom hook with proper typing
function useCounter(initialValue: number = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);
  
  const decrement = useCallback(() => {
    setCount(prev => prev - 1);
  }, []);
  
  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);
  
  return {
    count,
    increment,
    decrement,
    reset,
  };
}

// Hook with async operations
function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [url]);
  
  return { data, loading, error };
}
```

### 4. Form Validation with Zod

#### Schema Definition
```typescript
import { z } from "zod";

// Basic schema
const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  age: z.number().min(18, "Must be at least 18 years old"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Complex schema with transformations
const todoSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z.string().max(500, "Description too long").optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  dueDate: z.string().datetime().optional(),
  tags: z.array(z.string()).max(5, "Maximum 5 tags allowed").optional(),
});

// Schema with conditional validation
const conditionalSchema = z.object({
  type: z.enum(["individual", "company"]),
  name: z.string(),
  email: z.string().email(),
  companyName: z.string().optional(),
  taxId: z.string().optional(),
}).refine((data) => {
  if (data.type === "company") {
    return data.companyName && data.taxId;
  }
  return true;
}, {
  message: "Company name and tax ID are required for company accounts",
  path: ["companyName"],
});
```

#### Form Integration
```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type TodoFormData = z.infer<typeof todoSchema>;

function TodoForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      priority: "medium",
    },
  });
  
  const onSubmit = async (data: TodoFormData) => {
    try {
      // Handle form submission
      console.log(data);
      reset();
    } catch (error) {
      console.error("Form submission failed:", error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="title">Title</label>
        <input
          {...register("title")}
          type="text"
          id="title"
          className={errors.title ? "error" : ""}
        />
        {errors.title && (
          <span className="error-message">{errors.title.message}</span>
        )}
      </div>
      
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          {...register("description")}
          id="description"
          className={errors.description ? "error" : ""}
        />
        {errors.description && (
          <span className="error-message">{errors.description.message}</span>
        )}
      </div>
      
      <div>
        <label htmlFor="priority">Priority</label>
        <select {...register("priority")} id="priority">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Todo"}
      </button>
    </form>
  );
}
```

### 5. Tailwind CSS Integration

#### Configuration
```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          500: "#3b82f6",
          900: "#1e3a8a",
        },
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
```

#### Component Styling
```typescript
// Responsive component with Tailwind
function ResponsiveCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="
      w-full max-w-sm mx-auto
      bg-white dark:bg-gray-800
      rounded-lg shadow-md
      p-4 sm:p-6 lg:p-8
      border border-gray-200 dark:border-gray-700
      hover:shadow-lg transition-shadow duration-200
    ">
      {children}
    </div>
  );
}

// Button component with variants
interface ButtonProps {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

function Button({ 
  variant = "primary", 
  size = "md", 
  children, 
  onClick, 
  disabled 
}: ButtonProps) {
  const baseClasses = "font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
  };
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };
  
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabledClasses}
      `}
    >
      {children}
    </button>
  );
}
```

---

## 🛠️ Development Tools

### TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### ESLint Configuration
```javascript
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

---

## 📝 Study Plan

### Day 1-2: TypeScript Fundamentals
- Master basic types and interfaces
- Practice function typing
- Understand generics and utility types
- Complete TypeScript exercises

### Day 3-4: Next.js App Router
- Learn file-based routing
- Understand Server vs Client Components
- Practice layouts and templates
- Build simple pages

### Day 5-6: React with TypeScript
- Build typed components
- Create custom hooks
- Implement form validation
- Practice component composition

### Day 7: Integration & Testing
- Combine all concepts in Todo app
- Write component tests
- Implement responsive design
- Deploy to Vercel

---

## 🔍 Key Questions to Master

1. **When should you use Server vs Client Components?**
2. **How do you handle async operations in TypeScript?**
3. **What's the difference between interface and type?**
4. **How do you implement proper error boundaries?**
5. **When should you use generics in TypeScript?**
6. **How do you optimize Next.js performance?**

---

## 🎯 Week Assessment

### Knowledge Check
- [ ] Can explain TypeScript type system
- [ ] Understands Next.js App Router architecture
- [ ] Can build typed React components
- [ ] Knows how to validate forms with Zod

### Practical Skills
- [ ] Built functional Todo application
- [ ] Implemented proper TypeScript types
- [ ] Created responsive UI with Tailwind
- [ ] Deployed application to Vercel

---

## 📊 Next Week Preview

**Week 2: Server Components & Server Actions**
- Server Components for performance
- Server Actions for form handling
- Data fetching strategies
- SEO optimization techniques

*Focus: Leverage Next.js server-side capabilities*

---

*Last updated: [Date]* 