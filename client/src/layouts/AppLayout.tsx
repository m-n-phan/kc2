import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar, Header } from '../components'
import { cn } from '../utils/cn'

export interface AppLayoutProps {
  className?: string
}

export const AppLayout: React.FC<AppLayoutProps> = ({ className }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)

  return (
    <div className={cn('layout-shell min-h-screen bg-slate-50', className)}>
      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      {/* Main Content Area */}
      <div 
        className={cn(
          'transition-all duration-300 ease-in-out min-h-screen',
          sidebarCollapsed 
            ? 'ml-14' // 56px for collapsed sidebar
            : 'ml-60' // 240px for expanded sidebar
        )}
      >
        {/* Header */}
        <Header />
        
        {/* Page Content */}
        <main className="px-6 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
} 
