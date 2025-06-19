import React from 'react'
import { clsx } from 'clsx'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hover?: boolean
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role={props.onClick ? 'button' : undefined}
        className={clsx(
          'bg-white border border-slate-200 rounded-lg shadow-sm transition-shadow duration-200',
          'card-base',
          hover && 'hover:shadow-md',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card' 