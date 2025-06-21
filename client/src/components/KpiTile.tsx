import React from 'react'
import { clsx } from 'clsx'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export interface KpiTileProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  loading?: boolean
}

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus
}

const trendColors = {
  up: 'text-green-600',
  down: 'text-red-600',
  neutral: 'text-slate-500'
}

export const KpiTile = React.forwardRef<HTMLDivElement, KpiTileProps>(
  ({ className, title, value, change, trend = 'neutral', loading = false, ...props }, ref) => {
    const TrendIcon = trend ? trendIcons[trend] : null

    if (loading) {
      return (
        <div
          ref={ref}
          className={clsx(
            'card-base p-6 h-tile',
            'animate-pulse',
            className
          )}
          {...props}
        >
          <div className="h-4 bg-slate-200 rounded mb-3"></div>
          <div className="h-8 bg-slate-200 rounded mb-2"></div>
          <div className="h-3 bg-slate-200 rounded w-16"></div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={clsx(
          'card-base p-6 h-tile',
          'flex flex-col justify-between',
          className
        )}
        {...props}
      >
        <div>
          <h3 className="text-sm font-medium text-slate-600 mb-2">{title}</h3>
          <p className="text-2xl font-bold text-charcoal mb-1">{value}</p>
        </div>
        
        {change && TrendIcon && (
          <div className={clsx('flex items-center text-sm', trendColors[trend])}>
            <TrendIcon 
              className="h-4 w-4 mr-1" 
              aria-label={`${trend === 'up' ? 'Increase' : trend === 'down' ? 'Decrease' : 'No change'}`}
            />
            <span 
              className="font-medium"
              aria-label={`${change} ${trend === 'up' ? 'increase' : trend === 'down' ? 'decrease' : 'no change'}`}
            >
              {change}
            </span>
          </div>
        )}
      </div>
    )
  }
)

KpiTile.displayName = 'KpiTile' 