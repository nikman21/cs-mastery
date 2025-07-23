import { useState, useEffect } from 'react';

/**
 * useDebounce Hook
 * 
 * A custom hook that debounces a value, delaying updates until after 
 * the specified delay period has passed without new changes.
 * 
 * TODO: Implement the useDebounce hook with the following features:
 * 1. Generic type support for any value type
 * 2. Configurable delay period
 * 3. Automatic cleanup of timeouts
 * 4. Return debounced value
 * 5. Handle rapid value changes efficiently
 * 
 * Requirements:
 * - Use proper TypeScript generics
 * - Use setTimeout to delay value updates
 * - Clear previous timeouts when value changes
 * - Clean up timeout on unmount
 * - Return the debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  // TODO: Create state for debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  // TODO: Use useEffect to handle debouncing
  useEffect(() => {
    // TODO: Create a timeout to update debounced value
    // The timeout should wait for the specified delay
    // before updating debouncedValue with the new value
    
    const handler = setTimeout(() => {
      // TODO: Update debounced value after delay
      setDebouncedValue(value);
    }, delay);

    // TODO: Cleanup function
    // Should clear the timeout to prevent memory leaks
    // and prevent outdated updates
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // TODO: Add proper dependencies

  // TODO: Return the debounced value
  return debouncedValue;
}

// Usage examples:
// const searchTerm = 'react hooks';
// const debouncedSearchTerm = useDebounce(searchTerm, 300);
// // debouncedSearchTerm will only update 300ms after searchTerm stops changing

// In a search component:
// const [query, setQuery] = useState('');
// const debouncedQuery = useDebounce(query, 500);
// 
// useEffect(() => {
//   if (debouncedQuery) {
//     // Perform search
//     searchAPI(debouncedQuery);
//   }
// }, [debouncedQuery]); 