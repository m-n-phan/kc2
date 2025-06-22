import React from 'react'
import { cn } from '../utils/cn'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hover?: boolean
  interactive?: boolean
}

// Card variant utility map
const cardVariants = {
  base: 'card-base',
  hoverable: 'hover:shadow-md transition-shadow duration-200',
  interactive: 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2',
  nonInteractive: 'cursor-default'
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = true, interactive, children, onClick, onKeyDown, ...props }, ref) => {
    const isInteractive = interactive ?? !!onClick
    
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (onClick && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault()
        // Create a synthetic mouse event for consistency
        const syntheticEvent = {
          ...event,
          type: 'click',
          currentTarget: event.currentTarget,
          target: event.target,
        } as unknown as React.MouseEvent<HTMLDivElement>
        onClick(syntheticEvent)
      }
      onKeyDown?.(event)
    }

    return (
      <div
        ref={ref}
        role={isInteractive ? 'button' : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        className={cn(
          cardVariants.base,
          hover && cardVariants.hoverable,
          isInteractive ? cardVariants.interactive : cardVariants.nonInteractive,
          className
        )}
        onClick={onClick}
        onKeyDown={isInteractive ? handleKeyDown : onKeyDown}
        aria-pressed={isInteractive && onClick ? false : undefined}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card' 