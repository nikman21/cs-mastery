// Week 1 Examples: Generic React Components with TypeScript
// This file demonstrates advanced TypeScript patterns with generics

import React, { useState, useMemo, useCallback } from 'react';

// =============================================================================
// 1. GENERIC DATA LIST COMPONENT
// =============================================================================

interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataListProps<T extends Record<string, any>> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function DataList<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
  className = ''
}: DataListProps<T>) {
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const sortedData = useMemo(() => {
    if (!sortField) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortDirection]);

  const handleSort = useCallback((field: keyof T) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (data.length === 0) {
    return <div className="empty-state">{emptyMessage}</div>;
  }

  return (
    <div className={`data-list ${className}`}>
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                style={{ width: column.width }}
                className={column.sortable ? 'sortable' : ''}
                onClick={column.sortable ? () => handleSort(column.key) : undefined}
              >
                <div className="header-content">
                  {column.header}
                  {column.sortable && sortField === column.key && (
                    <span className="sort-indicator">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, index) => (
            <tr
              key={index}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={onRowClick ? 'clickable' : ''}
            >
              {columns.map((column) => (
                <td key={String(column.key)}>
                  {column.render
                    ? column.render(row[column.key], row)
                    : String(row[column.key])
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// =============================================================================
// 2. GENERIC SELECT COMPONENT
// =============================================================================

interface Option<T> {
  value: T;
  label: string;
  disabled?: boolean;
}

interface SelectProps<T> {
  options: Option<T>[];
  value: T | null;
  onChange: (value: T | null) => void;
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
  className?: string;
  disabled?: boolean;
}

export function Select<T>({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  multiple = false,
  searchable = false,
  className = '',
  disabled = false
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchTerm) return options;
    
    return options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm, searchable]);

  const handleOptionClick = useCallback((optionValue: T) => {
    if (multiple) {
      // Handle multiple selection logic
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter(v => v !== optionValue)
        : [...currentValues, optionValue];
      onChange(newValues as T);
    } else {
      onChange(optionValue);
      setIsOpen(false);
    }
  }, [multiple, value, onChange]);

  const getDisplayValue = useCallback(() => {
    if (!value) return placeholder;
    
    if (multiple && Array.isArray(value)) {
      if (value.length === 0) return placeholder;
      if (value.length === 1) {
        const option = options.find(opt => opt.value === value[0]);
        return option?.label || '';
      }
      return `${value.length} items selected`;
    }
    
    const option = options.find(opt => opt.value === value);
    return option?.label || '';
  }, [value, options, placeholder, multiple]);

  return (
    <div className={`select-container ${className} ${disabled ? 'disabled' : ''}`}>
      <div
        className={`select-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {searchable && isOpen ? (
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="select-search"
          />
        ) : (
          <span className="select-value">{getDisplayValue()}</span>
        )}
        <span className="select-arrow">▼</span>
      </div>
      
      {isOpen && (
        <div className="select-dropdown">
          {filteredOptions.length === 0 ? (
            <div className="select-no-options">No options found</div>
          ) : (
            filteredOptions.map((option, index) => (
              <div
                key={index}
                className={`select-option ${option.disabled ? 'disabled' : ''} ${
                  (multiple && Array.isArray(value) && value.includes(option.value)) ||
                  (!multiple && value === option.value)
                    ? 'selected'
                    : ''
                }`}
                onClick={() => !option.disabled && handleOptionClick(option.value)}
              >
                {multiple && (
                  <input
                    type="checkbox"
                    checked={Array.isArray(value) && value.includes(option.value)}
                    readOnly
                  />
                )}
                {option.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// 3. GENERIC MODAL COMPONENT
// =============================================================================

interface ModalProps<T = any> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  data?: T;
  onConfirm?: (data?: T) => void;
  confirmText?: string;
  cancelText?: string;
  showFooter?: boolean;
  className?: string;
}

export function Modal<T = any>({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  data,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  showFooter = false,
  className = ''
}: ModalProps<T>) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(data);
    }
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className={`modal modal-${size} ${className}`}>
        {title && (
          <div className="modal-header">
            <h3 className="modal-title">{title}</h3>
            <button className="modal-close" onClick={onClose}>
              ✕
            </button>
          </div>
        )}
        
        <div className="modal-content">
          {children}
        </div>
        
        {showFooter && (
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              {cancelText}
            </button>
            {onConfirm && (
              <button className="btn btn-primary" onClick={handleConfirm}>
                {confirmText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// 4. GENERIC FORM FIELD COMPONENT
// =============================================================================

interface FormFieldProps<T> {
  name: keyof T;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  value: T[keyof T];
  onChange: (name: keyof T, value: any) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export function FormField<T extends Record<string, any>>({
  name,
  label,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder,
  disabled = false
}: FormFieldProps<T>) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = type === 'number' ? Number(e.target.value) : e.target.value;
    onChange(name, newValue);
  };

  return (
    <div className="form-field">
      <label className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <input
        type={type}
        value={String(value || '')}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`form-input ${error ? 'error' : ''}`}
      />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

// =============================================================================
// 5. DEMO DATA AND USAGE EXAMPLES
// =============================================================================

// User interface for demo
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  role: 'admin' | 'user' | 'moderator';
  isActive: boolean;
}

// Product interface for demo
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  rating: number;
}

export const GenericComponentsDemo: React.FC = () => {
  // Sample data
  const users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 30, role: 'admin', isActive: true },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25, role: 'user', isActive: true },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35, role: 'moderator', isActive: false },
  ];

  const products: Product[] = [
    { id: 'p1', name: 'Laptop', price: 999, category: 'Electronics', inStock: true, rating: 4.5 },
    { id: 'p2', name: 'Phone', price: 599, category: 'Electronics', inStock: true, rating: 4.2 },
    { id: 'p3', name: 'Desk Chair', price: 299, category: 'Furniture', inStock: false, rating: 3.8 },
  ];

  // State
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'user' | 'moderator' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // User table columns
  const userColumns: Column<User>[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'age', header: 'Age', sortable: true, width: '80px' },
    { 
      key: 'role', 
      header: 'Role', 
      sortable: true,
      render: (role) => (
        <span className={`role-badge role-${role}`}>
          {String(role).toUpperCase()}
        </span>
      )
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (isActive) => (
        <span className={`status ${isActive ? 'active' : 'inactive'}`}>
          {isActive ? '✅ Active' : '❌ Inactive'}
        </span>
      )
    }
  ];

  // Product table columns
  const productColumns: Column<Product>[] = [
    { key: 'name', header: 'Product', sortable: true },
    { key: 'category', header: 'Category', sortable: true },
    { 
      key: 'price', 
      header: 'Price', 
      sortable: true,
      render: (price) => `$${Number(price).toFixed(2)}`
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (rating) => '⭐'.repeat(Math.floor(Number(rating)))
    },
    {
      key: 'inStock',
      header: 'Stock',
      render: (inStock) => inStock ? '✅ In Stock' : '❌ Out of Stock'
    }
  ];

  // Role options for select
  const roleOptions: Option<'admin' | 'user' | 'moderator'>[] = [
    { value: 'admin', label: 'Administrator' },
    { value: 'user', label: 'Regular User' },
    { value: 'moderator', label: 'Moderator' }
  ];

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="generic-components-demo">
      <h1>Generic Components Demo</h1>

      {/* Role Selection */}
      <section>
        <h2>Generic Select Component</h2>
        <Select
          options={roleOptions}
          value={selectedRole}
          onChange={setSelectedRole}
          placeholder="Select a role"
          searchable
        />
        {selectedRole && (
          <p>Selected role: <strong>{selectedRole}</strong></p>
        )}
      </section>

      {/* Users Table */}
      <section>
        <h2>Users Data Table</h2>
        <DataList
          data={users}
          columns={userColumns}
          onRowClick={handleUserClick}
          emptyMessage="No users found"
        />
      </section>

      {/* Products Table */}
      <section>
        <h2>Products Data Table</h2>
        <DataList
          data={products}
          columns={productColumns}
          emptyMessage="No products available"
        />
      </section>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="User Details"
        size="medium"
        showFooter
        onConfirm={() => console.log('User confirmed:', selectedUser)}
      >
        {selectedUser && (
          <div className="user-details">
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Age:</strong> {selectedUser.age}</p>
            <p><strong>Role:</strong> {selectedUser.role}</p>
            <p><strong>Status:</strong> {selectedUser.isActive ? 'Active' : 'Inactive'}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

// =============================================================================
// KEY TAKEAWAYS:
//
// 1. Generic components provide type safety while maintaining flexibility
// 2. Use proper constraints on generic types (T extends Record<string, any>)
// 3. Callbacks should be properly typed with generic parameters
// 4. useMemo and useCallback help optimize performance with generic components
// 5. Render props pattern works well with generics for custom rendering
// 6. Generic components can handle complex data structures safely
// ============================================================================= 