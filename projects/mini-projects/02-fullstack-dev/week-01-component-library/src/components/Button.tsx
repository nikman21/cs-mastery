import React from 'react';
import type { ButtonVariant, ButtonSize } from '@/types';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

/**
 * Button Component
 * 
 * A reusable button component with different variants and sizes.
 * 
 * TODO: Implement the Button component with the following features:
 * 1. Support different variants (primary, secondary, danger, success)
 * 2. Support different sizes (small, medium, large)
 * 3. Handle loading state with spinner
 * 4. Handle disabled state
 * 5. Apply proper CSS classes for styling
 * 6. Handle click events
 * 
 * Requirements:
 * - Use proper TypeScript typing
 * - Apply CSS classes based on variant and size: `btn btn-${variant} btn-${size}`
 * - Show loading spinner when loading prop is true
 * - Disable button when disabled or loading
 * - Forward all other props to the button element
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  onClick,
  disabled = false,
  loading = false,
  type = 'button',
  className = '',
  ...props
}) => {
  // TODO: Implement the button component
  // Hint: Use conditional rendering for loading state
  // Hint: Combine className prop with variant and size classes
  // Hint: Handle click events properly when not disabled/loading
  
  return (
    <button
      type={type}
      // TODO: Add proper className combining variant, size, loading state, and custom className
      className={`btn ${className}`}
      // TODO: Handle disabled state (should be disabled when disabled=true OR loading=true)
      disabled={disabled}
      // TODO: Handle onClick properly
      onClick={onClick}
      {...props}
    >
      {/* TODO: Implement loading state */}
      {/* Hint: Show spinner when loading, otherwise show children */}
      {children}
    </button>
  );
};

// TODO: Add React.memo optimization if needed
// export const Button = React.memo(ButtonComponent); 