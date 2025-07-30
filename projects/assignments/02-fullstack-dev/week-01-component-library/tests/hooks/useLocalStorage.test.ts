import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('useLocalStorage Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns initial value when localStorage is empty', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    expect(result.current[0]).toBe('initial');
    expect(localStorageMock.getItem).toHaveBeenCalledWith('test-key');
  });

  it('returns stored value from localStorage', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify('stored-value'));
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    expect(result.current[0]).toBe('stored-value');
  });

  it('updates localStorage when value changes', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      result.current[1]('new-value');
    });
    
    expect(result.current[0]).toBe('new-value');
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'test-key',
      JSON.stringify('new-value')
    );
  });

  it('handles function updates', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify('initial'));
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      result.current[1]((prev) => prev + '-updated');
    });
    
    expect(result.current[0]).toBe('initial-updated');
  });

  it('handles complex objects', () => {
    const initialObject = { name: 'John', age: 30 };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(initialObject));
    
    const { result } = renderHook(() => 
      useLocalStorage('user', { name: '', age: 0 })
    );
    
    expect(result.current[0]).toEqual(initialObject);
    
    const updatedObject = { name: 'Jane', age: 25 };
    act(() => {
      result.current[1](updatedObject);
    });
    
    expect(result.current[0]).toEqual(updatedObject);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'user',
      JSON.stringify(updatedObject)
    );
  });

  it('handles localStorage errors gracefully', () => {
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'fallback'));
    
    expect(result.current[0]).toBe('fallback');
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  it('handles setItem errors gracefully', () => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('Storage full');
    });
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      result.current[1]('new-value');
    });
    
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
}); 