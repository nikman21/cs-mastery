import { useState, useEffect, useCallback } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseFetchReturn<T> extends FetchState<T> {
  refetch: () => void;
}

/**
 * useFetch Hook
 * 
 * A custom hook for data fetching with loading, error, and success states.
 * 
 * TODO: Implement the useFetch hook with the following features:
 * 1. Generic type support for response data
 * 2. Loading state management
 * 3. Error handling
 * 4. Automatic fetching on mount and URL change
 * 5. Manual refetch capability
 * 6. Cleanup for cancelled requests
 * 
 * Requirements:
 * - Use proper TypeScript generics
 * - Handle all fetch states (loading, success, error)
 * - Implement abort controller for cleanup
 * - Use useCallback for refetch function
 * - Handle edge cases (empty URL, network errors)
 */
export function useFetch<T>(url: string): UseFetchReturn<T> {
  // TODO: Initialize state with proper types
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null
  });

  // TODO: Implement fetchData function with useCallback
  const fetchData = useCallback(async () => {
    // TODO: Implement fetch logic
    // 1. Set loading to true and clear error
    // 2. Use AbortController for cleanup
    // 3. Make fetch request
    // 4. Handle response (check if ok, parse JSON)
    // 5. Update state with data or error
    // 6. Handle abort and other errors
    
    try {
      // TODO: Set loading state
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // TODO: Create AbortController
      // TODO: Make fetch request with abort signal
      // TODO: Check if response is ok
      // TODO: Parse JSON data
      // TODO: Update state with successful data
      
    } catch (error) {
      // TODO: Handle different error types
      // - Check if error is due to abort
      // - Handle network errors
      // - Handle parsing errors
      // - Update state with error message
    }
  }, [url]);

  // TODO: Use useEffect to fetch data when URL changes
  useEffect(() => {
    // TODO: Only fetch if URL is provided
    if (url) {
      fetchData();
    }
    
    // TODO: Return cleanup function
    // Should abort any pending requests
  }, [fetchData]);

  // TODO: Return state and refetch function
  return {
    ...state,
    refetch: fetchData
  };
}

// Usage example:
// const { data, loading, error, refetch } = useFetch<User[]>('/api/users'); 