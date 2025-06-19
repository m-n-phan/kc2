import React from 'react'
import { clsx } from 'clsx'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const buttonVariants = {
  primary: 'bg-primary text-white hover:bg-primary/90',
  secondary: 'bg-slate-200 text-slate-700 hover:bg-slate-300',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100'
}

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-body',
  lg: 'px-6 py-3 text-lg'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', disabled, type = 'button', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={clsx(
          'btn-base',
          'touch-target',
          'inline-flex items-center justify-center',
          'rounded-md font-medium',
          'border border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button' 