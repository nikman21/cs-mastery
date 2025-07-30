// Global type definitions for the component library

export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  role: 'admin' | 'user' | 'moderator';
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  rating: number;
}

// Generic types for components
export interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

// Utility types
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';
export type ButtonSize = 'small' | 'medium' | 'large';
export type SortDirection = 'asc' | 'desc'; 