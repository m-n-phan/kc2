import React from 'react'
import { Bell, User } from 'lucide-react'
import { Button } from './Button'
import { Badge } from './Badge'
import { ContextButton } from './ContextButton'
import { cn } from '../utils/cn'

export interface HeaderProps {
  className?: string
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn('h-16 bg-white border-b border-slate-200 px-6', className)}>
      <div className="h-full flex items-center">
        {/* Context Button - positioned left, styled for hierarchy */}
        <ContextButton className="text-slate-600 hover:text-slate-800" />
        
        {/* Flex grow to push right section to end */}
        <div className="flex-grow" />

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-slate-500 hover:text-slate-700 min-w-touch min-h-touch"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
            </Button>
            <Badge 
              variant="error" 
              className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs min-w-[18px] h-[18px] flex items-center justify-center"
            >
              3
            </Badge>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium text-slate-900">Sarah Johnson</div>
              <div className="text-xs text-slate-500">Kitchen Manager</div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="p-2 rounded-full min-w-touch min-h-touch"
              aria-label="User menu"
            >
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
} 
