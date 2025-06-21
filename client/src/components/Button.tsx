import React from 'react'
import { clsx } from 'clsx'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  loading?: boolean
}

// Button variant utility map for consistency
const buttonVariants = {
  primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary/50',
  secondary: 'bg-slate-200 text-slate-700 hover:bg-slate-300 focus:ring-slate-500/50',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-500/50'
}

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm min-h-[32px]',
  md: 'px-4 py-2 text-[16px] min-h-[40px]',
  lg: 'px-6 py-3 text-lg min-h-[44px]'
}

const buttonBase = [
  'btn-base',
  'touch-target',
  'inline-flex items-center justify-center gap-2',
  'rounded-md font-medium',
  'border border-transparent',
  'transition-all duration-150 ease-in-out',
  'focus:outline-none focus:ring-2 focus:ring-offset-2',
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none'
]

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    disabled, 
    loading = false,
    type = 'button', 
    children, 
    'aria-label': ariaLabel,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading
    
    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-label={ariaLabel}
        aria-disabled={isDisabled}
        className={clsx(
          buttonBase,
          buttonVariants[variant],
          buttonSizes[size],
          loading && 'cursor-wait',
          className
        )}
        {...props}
      >
        {loading && (
          <svg 
            className="w-4 h-4 animate-spin" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
              fill="none"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        <span className={loading ? 'opacity-70' : ''}>
          {children}
        </span>
      </button>
    )
  }
)

Button.displayName = 'Button' 