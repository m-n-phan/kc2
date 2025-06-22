import React from 'react'
import { cn } from '../utils/cn'

export interface IconWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'filled'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const iconVariants = {
  default: 'text-slate-600 hover:text-slate-700',
  filled: 'bg-primary text-white hover:bg-primary/90'
}

const iconSizes = {
  sm: 'h-8 w-8 p-1',
  md: 'h-10 w-10 p-2',
  lg: 'h-12 w-12 p-2.5'
}

export const IconWrapper = React.forwardRef<HTMLDivElement, IconWrapperProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center',
          'rounded-md',
          'transition-colors duration-150',
          variant === 'filled' && 'shadow-sm',
          iconVariants[variant],
          iconSizes[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

IconWrapper.displayName = 'IconWrapper' 