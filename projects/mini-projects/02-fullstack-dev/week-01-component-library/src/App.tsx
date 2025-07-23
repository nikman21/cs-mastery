import React, { useState } from 'react';
import { Button, DataTable } from './components';
import { useFetch, useLocalStorage, useDebounce } from './hooks';
import type { User, Product, Column } from './types';

// Sample data for demonstrations
const sampleUsers: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 30, role: 'admin', isActive: true },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25, role: 'user', isActive: true },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35, role: 'moderator', isActive: false },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', age: 28, role: 'user', isActive: true },
];

const sampleProducts: Product[] = [
  { id: 'p1', name: 'Laptop', price: 999, category: 'Electronics', inStock: true, rating: 4.5 },
  { id: 'p2', name: 'Phone', price: 599, category: 'Electronics', inStock: true, rating: 4.2 },
  { id: 'p3', name: 'Desk Chair', price: 299, category: 'Furniture', inStock: false, rating: 3.8 },
  { id: 'p4', name: 'Monitor', price: 399, category: 'Electronics', inStock: true, rating: 4.7 },
];

function App() {
  // Demo state
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Hook demonstrations
  const [storedName, setStoredName] = useLocalStorage('demo-name', '');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Note: useFetch would normally fetch from a real API
  // For demo purposes, we'll show how it would be used
  // const { data: apiUsers, loading, error } = useFetch<User[]>('/api/users');

  // Table column definitions
  const userColumns: Column<User>[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'age', header: 'Age', sortable: true, width: '100px' },
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
        <span style={{ color: isActive ? 'green' : 'red' }}>
          {isActive ? '✅ Active' : '❌ Inactive'}
        </span>
      )
    }
  ];

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

  // Filter users based on debounced search term
  const filteredUsers = sampleUsers.filter(user =>
    user.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  return (
    <div className="demo-app">
      <h1>React + TypeScript Component Library Demo</h1>
      <p>This demo showcases the components and hooks you'll build in Week 1.</p>

      {/* Button Component Demo */}
      <section className="demo-section">
        <h2>Button Component</h2>
        <p>Reusable buttons with different variants and sizes:</p>
        
        <h3>Variants</h3>
        <div className="button-group">
          <Button variant="primary" onClick={() => setCount(c => c + 1)}>
            Primary ({count})
          </Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="success">Success</Button>
        </div>

        <h3>Sizes</h3>
        <div className="button-group">
          <Button size="small">Small</Button>
          <Button size="medium">Medium</Button>
          <Button size="large">Large</Button>
        </div>

        <h3>States</h3>
        <div className="button-group">
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      {/* Hooks Demo */}
      <section className="demo-section">
        <h2>Custom Hooks Demo</h2>
        
        <div className="demo-grid">
          <div className="demo-card">
            <h3>useLocalStorage Hook</h3>
            <p>Persistent state that survives page reloads:</p>
            <div className="input-group">
              <label>Your Name:</label>
              <input
                type="text"
                value={storedName}
                onChange={(e) => setStoredName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <p>Stored value: <strong>{storedName || 'None'}</strong></p>
            <p><small>Try refreshing the page - your name will persist!</small></p>
          </div>

          <div className="demo-card">
            <h3>useDebounce Hook</h3>
            <p>Delays updates to improve performance:</p>
            <div className="input-group">
              <label>Search Users:</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Type to search users..."
              />
            </div>
            <p>Current search: <strong>{searchTerm}</strong></p>
            <p>Debounced search: <strong>{debouncedSearchTerm}</strong></p>
            <p><small>Notice the delay between typing and debounced value updating</small></p>
          </div>
        </div>
      </section>

      {/* DataTable Demo */}
      <section className="demo-section">
        <h2>DataTable Component</h2>
        <p>Generic data tables with sorting and custom rendering:</p>

        <h3>Users Table</h3>
        <DataTable
          data={filteredUsers}
          columns={userColumns}
          onRowClick={(user) => setSelectedUser(user)}
          emptyMessage="No users found matching your search"
        />
        
        {selectedUser && (
          <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f0f0', borderRadius: '0.5rem' }}>
            <h4>Selected User:</h4>
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Role:</strong> {selectedUser.role}</p>
          </div>
        )}

        <h3>Products Table</h3>
        <DataTable
          data={sampleProducts}
          columns={productColumns}
          emptyMessage="No products available"
        />
      </section>

      {/* Implementation Status */}
      <section className="demo-section">
        <h2>Implementation Status</h2>
        <p>Components and hooks to implement:</p>
        <ul>
          <li>✅ Button Component - Variants, sizes, loading states</li>
          <li>✅ DataTable Component - Generic types, sorting, custom rendering</li>
          <li>✅ useFetch Hook - Data fetching with loading/error states</li>
          <li>✅ useLocalStorage Hook - Persistent state management</li>
          <li>✅ useDebounce Hook - Performance optimization</li>
        </ul>
        <p><strong>TODO:</strong> Implement the missing functionality marked with TODO comments in the source files.</p>
      </section>
    </div>
  );
}

export default App; 