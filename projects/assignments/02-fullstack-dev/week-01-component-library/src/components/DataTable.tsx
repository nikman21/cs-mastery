import React, { useState, useMemo, useCallback } from 'react';
import type { Column, SortDirection } from '@/types';

interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

/**
 * Generic DataTable Component
 * 
 * A reusable data table component that works with any data type.
 * 
 * TODO: Implement the DataTable component with the following features:
 * 1. Generic type support for any data structure
 * 2. Sortable columns (when column.sortable is true)
 * 3. Custom cell rendering (when column.render is provided)
 * 4. Loading state
 * 5. Empty state message
 * 6. Row click handling
 * 7. Performance optimization with useMemo and useCallback
 * 
 * Requirements:
 * - Use TypeScript generics properly
 * - Implement sorting functionality
 * - Handle loading and empty states
 * - Use performance optimizations
 * - Make rows clickable when onRowClick is provided
 */
export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
  className = ''
}: DataTableProps<T>) {
  // TODO: Add state for sorting
  // Hint: You'll need sortField and sortDirection state
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // TODO: Implement sorted data with useMemo
  // This should sort the data based on current sortField and sortDirection
  const sortedData = useMemo(() => {
    // TODO: Implement sorting logic
    // If no sortField, return original data
    // Otherwise, sort data by the sortField in the specified direction
    return data;
  }, [data, sortField, sortDirection]);

  // TODO: Implement handleSort function with useCallback
  // This should update sortField and sortDirection when a column header is clicked
  const handleSort = useCallback((field: keyof T) => {
    // TODO: Implement sort logic
    // If clicking the same field, toggle direction
    // If clicking a new field, set it as sortField with 'asc' direction
  }, [sortField]);

  // TODO: Handle loading state
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // TODO: Handle empty state
  if (data.length === 0) {
    return <div className="empty-state">{emptyMessage}</div>;
  }

  return (
    <div className={`data-table ${className}`}>
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                style={{ width: column.width }}
                // TODO: Add className for sortable columns
                className={column.sortable ? 'sortable' : ''}
                // TODO: Add onClick handler for sortable columns
                onClick={column.sortable ? () => handleSort(column.key) : undefined}
              >
                <div className="header-content">
                  {column.header}
                  {/* TODO: Add sort indicator */}
                  {/* Show sort arrow when this column is the current sortField */}
                  {column.sortable && sortField === column.key && (
                    <span className="sort-indicator">
                      {/* TODO: Show up arrow for 'asc', down arrow for 'desc' */}
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* TODO: Map over sortedData instead of data */}
          {data.map((row, index) => (
            <tr
              key={index}
              // TODO: Add onClick handler if onRowClick is provided
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              // TODO: Add 'clickable' className if onRowClick is provided
              className={onRowClick ? 'clickable' : ''}
            >
              {columns.map((column) => (
                <td key={String(column.key)}>
                  {/* TODO: Use custom renderer if provided, otherwise show raw value */}
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

// TODO: Add React.memo optimization
// export const DataTable = React.memo(DataTableComponent) as typeof DataTableComponent; 