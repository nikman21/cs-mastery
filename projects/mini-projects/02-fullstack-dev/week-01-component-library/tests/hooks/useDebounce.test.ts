import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '@/hooks/useDebounce';

// Mock timers
vi.useFakeTimers();

describe('useDebounce Hook', () => {
  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('debounces value updates', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    expect(result.current).toBe('initial');

    // Update value
    rerender({ value: 'updated', delay: 500 });
    
    // Should still have old value before delay
    expect(result.current).toBe('initial');

    // Fast-forward time by 500ms
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Should now have updated value
    expect(result.current).toBe('updated');
  });

  it('cancels previous timeout on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    // First update
    rerender({ value: 'first', delay: 500 });
    
    // Advance time by 300ms (not enough to trigger)
    act(() => {
      vi.advanceTimersByTime(300);
    });
    
    expect(result.current).toBe('initial');

    // Second update before first timeout completes
    rerender({ value: 'second', delay: 500 });
    
    // Advance by 300ms again
    act(() => {
      vi.advanceTimersByTime(300);
    });
    
    // Should still be initial (first timeout was cancelled)
    expect(result.current).toBe('initial');

    // Complete the second timeout
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Should now be 'second', not 'first'
    expect(result.current).toBe('second');
  });

  it('handles different delay values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );

    rerender({ value: 'updated', delay: 300 });
    
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('initial');

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('updated');
  });

  it('works with different value types', () => {
    // Test with numbers
    const { result: numberResult, rerender: numberRerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 0, delay: 100 } }
    );

    numberRerender({ value: 42, delay: 100 });
    
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    expect(numberResult.current).toBe(42);

    // Test with objects
    const initialObj = { name: 'John' };
    const updatedObj = { name: 'Jane' };
    
    const { result: objectResult, rerender: objectRerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: initialObj, delay: 100 } }
    );

    objectRerender({ value: updatedObj, delay: 100 });
    
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    expect(objectResult.current).toEqual(updatedObj);
  });

  it('cleans up timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    
    const { unmount } = renderHook(() => useDebounce('test', 500));
    
    unmount();
    
    expect(clearTimeoutSpy).toHaveBeenCalled();
    
    clearTimeoutSpy.mockRestore();
  });
}); 