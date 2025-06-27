import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  BookOpen, 
  ClipboardCheck, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { cn } from '../utils/cn'
import { Button } from './Button'

export interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  className?: string
}

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard
  },
  {
    name: 'Training',
    href: '/training',
    icon: BookOpen,
    badge: '3'
  },
  {
    name: 'Checklists',
    href: '/checklists',
    icon: ClipboardCheck
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: BarChart3
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings
  }
]

export const Sidebar: React.FC<SidebarProps> = ({ 
  collapsed, 
  onToggle, 
  className 
}) => {
  return (
    <div 
      className={cn(
        'fixed left-0 top-0 h-full bg-white border-r border-slate-200 z-40',
        'transition-all duration-300 ease-in-out',
        'w-60',
        className
      )}
    >
      {/* Header */}
      <div className={cn(
        "h-16 flex items-center border-b border-slate-200",
        collapsed ? "justify-center px-2" : "justify-between px-4"
      )}>
        {!collapsed && (
          <div className="flex items-center gap-brand-gap">
            <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">KC</span>
            </div>
            <span className="font-semibold text-charcoal">KitchenCoach</span>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="p-1.5 hover:bg-slate-100 min-w-touch min-h-touch flex items-center justify-center"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                'hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                'min-w-touch min-h-touch', // Accessibility fix
                isActive
                  ? collapsed 
                    ? 'bg-slate-100 text-primary'
                    : 'bg-primary/10 text-primary border-r-2 border-primary'
                  : collapsed
                    ? 'text-slate-500 hover:text-slate-600 hover:bg-slate-100'
                    : 'text-slate-600 hover:text-slate-900',
                collapsed && 'justify-center px-2'
              )
            }
          >
            <item.icon className={cn('w-5 h-5', !collapsed && 'mr-3')} />
            {!collapsed && (
              <>
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-4 py-4 border-t border-slate-200">
          <div className="text-xs text-slate-500 text-center">
            Version 2.0.0
          </div>
        </div>
      )}
    </div>
  )
} 
