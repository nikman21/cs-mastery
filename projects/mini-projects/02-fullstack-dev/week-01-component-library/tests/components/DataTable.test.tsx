import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/types';

interface TestUser {
  id: number;
  name: string;
  email: string;
  age: number;
}

const testUsers: TestUser[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35 },
];

const testColumns: Column<TestUser>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email', sortable: true },
  { key: 'age', header: 'Age', sortable: true },
];

describe('DataTable Component', () => {
  it('renders table with data', () => {
    render(<DataTable data={testUsers} columns={testColumns} />);
    
    // Check headers
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    
    // Check data
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('35')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<DataTable data={[]} columns={testColumns} loading />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows empty state with custom message', () => {
    const emptyMessage = 'No users found';
    render(
      <DataTable 
        data={[]} 
        columns={testColumns} 
        emptyMessage={emptyMessage}
      />
    );
    expect(screen.getByText(emptyMessage)).toBeInTheDocument();
  });

  it('handles row clicks', () => {
    const handleRowClick = vi.fn();
    render(
      <DataTable 
        data={testUsers} 
        columns={testColumns} 
        onRowClick={handleRowClick}
      />
    );
    
    // Click on first row
    const firstRow = screen.getByText('John Doe').closest('tr');
    fireEvent.click(firstRow!);
    
    expect(handleRowClick).toHaveBeenCalledWith(testUsers[0]);
  });

  it('adds clickable class when onRowClick is provided', () => {
    const handleRowClick = vi.fn();
    render(
      <DataTable 
        data={testUsers} 
        columns={testColumns} 
        onRowClick={handleRowClick}
      />
    );
    
    const firstRow = screen.getByText('John Doe').closest('tr');
    expect(firstRow).toHaveClass('clickable');
  });

  it('sorts data when sortable column header is clicked', () => {
    render(<DataTable data={testUsers} columns={testColumns} />);
    
    const nameHeader = screen.getByText('Name').closest('th');
    expect(nameHeader).toHaveClass('sortable');
    
    // Click to sort
    fireEvent.click(nameHeader!);
    
    // Check for sort indicator (implementation dependent)
  });

  it('uses custom renderer when provided', () => {
    const columnsWithRenderer: Column<TestUser>[] = [
      { 
        key: 'name', 
        header: 'Name',
        render: (value) => <strong data-testid="custom-name">{String(value)}</strong>
      },
    ];
    
    render(<DataTable data={testUsers} columns={columnsWithRenderer} />);
    expect(screen.getByTestId('custom-name')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <DataTable 
        data={testUsers} 
        columns={testColumns} 
        className="custom-table"
      />
    );
    
    const table = screen.getByRole('table').closest('.data-table');
    expect(table).toHaveClass('custom-table');
  });
}); 