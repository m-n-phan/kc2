import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'

// Wrapper component for testing with router
const SidebarWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('Sidebar', () => {

  test('renders sidebar with all navigation items', () => {
    render(
      <SidebarWrapper>
        <Sidebar />
      </SidebarWrapper>
    )

    // Check brand elements
    expect(screen.getByText('KitchenCoach')).toBeInTheDocument()
    expect(screen.getByText('KC')).toBeInTheDocument()

    // Check navigation items
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Training')).toBeInTheDocument()
    expect(screen.getByText('Checklists')).toBeInTheDocument()
    expect(screen.getByText('Reports')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()

    // Check version footer
    expect(screen.getByText('Version 2.0.0')).toBeInTheDocument()
  })



  test('shows training badge', () => {
    render(
      <SidebarWrapper>
        <Sidebar />
      </SidebarWrapper>
    )

    expect(screen.getByText('3')).toBeInTheDocument()
  })

  test('navigation links have correct href attributes', () => {
    render(
      <SidebarWrapper>
        <Sidebar />
      </SidebarWrapper>
    )

    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /training/i })).toHaveAttribute('href', '/training')
    expect(screen.getByRole('link', { name: /checklists/i })).toHaveAttribute('href', '/checklists')
    expect(screen.getByRole('link', { name: /reports/i })).toHaveAttribute('href', '/reports')
    expect(screen.getByRole('link', { name: /settings/i })).toHaveAttribute('href', '/settings')
  })

  test('links are focusable', () => {
    render(
      <SidebarWrapper>
        <Sidebar />
      </SidebarWrapper>
    )

    const dashboardLink = screen.getByRole('link', { name: /dashboard/i })
    dashboardLink.focus()
    expect(dashboardLink).toHaveFocus()
  })

  test('applies custom className when provided', () => {
    const customClass = 'custom-sidebar'
    const { container } = render(
      <SidebarWrapper>
        <Sidebar className={customClass} />
      </SidebarWrapper>
    )

    const sidebar = container.firstChild as HTMLElement
    expect(sidebar).toHaveClass(customClass)
  })
})
