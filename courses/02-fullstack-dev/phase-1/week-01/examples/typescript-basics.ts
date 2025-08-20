/*
 * TypeScript Fundamentals Examples
 * Week 1 - Full-Stack Development
 * 
 * This file demonstrates:
 * - Basic TypeScript types and interfaces
 * - Function typing and overloads
 * - Generics and utility types
 * - Advanced TypeScript patterns
 */

// ============================================================================
// 1. BASIC TYPES
// ============================================================================

// Primitive types
let name: string = "John Doe";
let age: number = 30;
let isActive: boolean = true;
let hobbies: string[] = ["reading", "coding", "gaming"];
let tuple: [string, number] = ["age", 25];

// Union types
type Status = "loading" | "success" | "error";
type ID = string | number;

let currentStatus: Status = "loading";
let userId: ID = "user_123";

// Literal types
type Direction = "north" | "south" | "east" | "west";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

// ============================================================================
// 2. OBJECT TYPES & INTERFACES
// ============================================================================

// Basic interface
interface User {
  id: number;
  name: string;
  email: string;
  isActive?: boolean; // Optional property
  readonly createdAt: Date; // Readonly property
}

// Interface with methods
interface UserService {
  getUser(id: number): Promise<User>;
  createUser(user: Omit<User, "id" | "createdAt">): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  deleteUser(id: number): Promise<void>;
}

// Interface extension
interface AdminUser extends User {
  role: "admin" | "super_admin";
  permissions: string[];
}

// Type aliases
type Point = {
  x: number;
  y: number;
};

type Circle = Point & {
  radius: number;
};

// ============================================================================
// 3. FUNCTION TYPES
// ============================================================================

// Basic function typing
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

// Function type aliases
type MathOperation = (a: number, b: number) => number;
type EventHandler<T> = (event: T) => void;

const divide: MathOperation = (a, b) => a / b;
const handleClick: EventHandler<MouseEvent> = (event) => {
  console.log("Clicked at:", event.clientX, event.clientY);
};

// ============================================================================
// 4. GENERICS
// ============================================================================

// Generic function
function identity<T>(arg: T): T {
  return arg;
}

// Generic interface
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  timestamp: Date;
}

// Generic class
class Container<T> {
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  getValue(): T {
    return this.value;
  }

  setValue(value: T): void {
    this.value = value;
  }
}

// Generic constraints
interface HasLength {
  length: number;
}

function getLength<T extends HasLength>(arg: T): number {
  return arg.length;
}

// Multiple constraints
interface HasId {
  id: number;
}

interface HasName {
  name: string;
}

function processEntity<T extends HasId & HasName>(entity: T): string {
  return `${entity.name} (ID: ${entity.id})`;
}

// ============================================================================
// 5. UTILITY TYPES
// ============================================================================

interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
}

// Make all properties optional
type PartialUser = Partial<User>;

// Make all properties required
type RequiredUser = Required<User>;

// Pick specific properties
type UserBasicInfo = Pick<User, "name" | "email">;

// Omit specific properties
type UserWithoutId = Omit<User, "id" | "createdAt">;

// Make specific properties optional
type UserUpdate = Partial<Pick<User, "name" | "email" | "isActive">>;

// Extract return type of a function
type AddResult = ReturnType<typeof add>;

// Extract parameter types of a function
type AddParams = Parameters<typeof add>;

// ============================================================================
// 6. ADVANCED PATTERNS
// ============================================================================

// Conditional types
type NonNullable<T> = T extends null | undefined ? never : T;
type ArrayElement<T> = T extends Array<infer U> ? U : never;
type PromiseResult<T> = T extends Promise<infer U> ? U : never;

// Mapped types
type ReadonlyUser = Readonly<User>;
type OptionalUser = { [K in keyof User]?: User[K] };

// Template literal types
type EmailLocale = "en" | "es" | "fr";
type EmailTemplate = `welcome_${EmailLocale}`;
type ApiEndpoint = `/api/${string}`;

// ============================================================================
// 7. PRACTICAL EXAMPLES
// ============================================================================

// API client with generics
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async post<T, U>(endpoint: string, data: T): Promise<ApiResponse<U>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
}

// Event emitter with generics
type EventMap = {
  userCreated: User;
  userUpdated: { oldUser: User; newUser: User };
  userDeleted: number; // user ID
};

class EventEmitter {
  private listeners: Map<keyof EventMap, Function[]> = new Map();

  on<K extends keyof EventMap>(event: K, callback: (data: EventMap[K]) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }
}

// State management with generics
interface StateManager<T> {
  getState(): T;
  setState(newState: T): void;
  subscribe(callback: (state: T) => void): () => void;
}

class SimpleStateManager<T> implements StateManager<T> {
  private state: T;
  private subscribers: Set<(state: T) => void> = new Set();

  constructor(initialState: T) {
    this.state = initialState;
  }

  getState(): T {
    return this.state;
  }

  setState(newState: T): void {
    this.state = newState;
    this.subscribers.forEach(callback => callback(this.state));
  }

  subscribe(callback: (state: T) => void): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }
}

// ============================================================================
// 8. ERROR HANDLING PATTERNS
// ============================================================================

// Result type for error handling
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

// Async result wrapper
async function safeAsync<T>(
  promise: Promise<T>
): Promise<Result<T, Error>> {
  try {
    const data = await promise;
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error(String(error))
    };
  }
}

// ============================================================================
// 9. VALIDATION PATTERNS
// ============================================================================

// Type guard functions
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value);
}

function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value &&
    "email" in value
  );
}

// Validation function
function validateUser(data: unknown): Result<User, string[]> {
  const errors: string[] = [];

  if (!isUser(data)) {
    errors.push("Invalid user object");
    return { success: false, error: errors };
  }

  if (!isString(data.name) || data.name.trim().length === 0) {
    errors.push("Name is required");
  }

  if (!isString(data.email) || !data.email.includes("@")) {
    errors.push("Valid email is required");
  }

  if (errors.length > 0) {
    return { success: false, error: errors };
  }

  return { success: true, data: data as User };
}

// ============================================================================
// 10. USAGE EXAMPLES
// ============================================================================

// Example usage of all the patterns
async function exampleUsage() {
  // Basic types
  const user: User = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    isActive: true,
    createdAt: new Date(),
  };

  // Generic container
  const userContainer = new Container(user);
  console.log(userContainer.getValue());

  // API client
  const apiClient = new ApiClient("https://api.example.com");
  const userResponse = await apiClient.get<User>("/users/1");
  console.log(userResponse.data);

  // Event emitter
  const eventEmitter = new EventEmitter();
  eventEmitter.on("userCreated", (newUser) => {
    console.log("New user created:", newUser.name);
  });

  // State manager
  const userState = new SimpleStateManager<User[]>([]);
  const unsubscribe = userState.subscribe((users) => {
    console.log("Users updated:", users.length);
  });

  // Validation
  const validationResult = validateUser(user);
  if (validationResult.success) {
    console.log("User is valid:", validationResult.data);
  } else {
    console.log("Validation errors:", validationResult.error);
  }

  // Cleanup
  unsubscribe();
}

// Export for use in other files
export {
  User,
  UserService,
  AdminUser,
  Point,
  Circle,
  MathOperation,
  EventHandler,
  ApiResponse,
  Container,
  ApiClient,
  EventEmitter,
  SimpleStateManager,
  Result,
  safeAsync,
  validateUser,
  isString,
  isNumber,
  isUser,
}; 