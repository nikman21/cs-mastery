import { useState, useCallback } from 'react';

/**
 * useLocalStorage Hook
 * 
 * A custom hook for managing state that persists in localStorage.
 * 
 * TODO: Implement the useLocalStorage hook with the following features:
 * 1. Generic type support for any data type
 * 2. Automatic serialization/deserialization
 * 3. Error handling for localStorage operations
 * 4. Sync with localStorage on value changes
 * 5. Support for function updates like useState
 * 6. Return tuple like useState
 * 
 * Requirements:
 * - Use proper TypeScript generics
 * - Handle localStorage errors gracefully
 * - Support both direct values and updater functions
 * - Serialize/deserialize data properly
 * - Initialize with localStorage value or fallback to initial value
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  
  // TODO: Initialize state with value from localStorage or initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // TODO: Get item from localStorage
      // TODO: Parse JSON and return parsed value
      // TODO: If no item exists, return initialValue
      // TODO: Handle parsing errors
      return initialValue;
    } catch (error) {
      // TODO: Log error and return initialValue
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // TODO: Implement setValue function with useCallback
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      // TODO: Handle function updates
      // If value is a function, call it with current value
      // Otherwise use value directly
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // TODO: Update state
      setStoredValue(valueToStore);
      
      // TODO: Save to localStorage
      // Serialize the value to JSON string
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // TODO: Handle localStorage errors
      // This can happen if storage is full or in incognito mode
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // TODO: Return tuple [value, setValue] like useState
  return [storedValue, setValue];
}

// Usage examples:
// const [name, setName] = useLocalStorage('user-name', '');
// const [user, setUser] = useLocalStorage<User | null>('current-user', null);
// const [settings, setSettings] = useLocalStorage('app-settings', { theme: 'light' }); 