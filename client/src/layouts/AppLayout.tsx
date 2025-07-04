import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar, Header } from '../components'
import { cn } from '../utils/cn'

export interface AppLayoutProps {
  className?: string
}

export const AppLayout: React.FC<AppLayoutProps> = ({ className }) => {


  return (
    <div className={cn('layout-shell min-h-screen bg-slate-50', className)}>
      {/* Sidebar */}
      <Sidebar />
      


      {/* Main Content Area */}
      <div
        className={cn(
          'transition-all duration-300 ease-in-out min-h-screen',
          'ml-60'
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
