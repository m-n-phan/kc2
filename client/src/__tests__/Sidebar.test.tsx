import { describe, test, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'

// Wrapper component for testing with router
const SidebarWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('Sidebar', () => {
  const mockOnToggle = vi.fn()

  beforeEach(() => {
    mockOnToggle.mockClear()
  })

  test('renders sidebar with icons and text', () => {
    render(
      <SidebarWrapper>
        <Sidebar collapsed={false} onToggle={mockOnToggle} />
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


  test('calls onToggle when toggle button is clicked', () => {
    render(
      <SidebarWrapper>
        <Sidebar collapsed={false} onToggle={mockOnToggle} />
      </SidebarWrapper>
    )

    const toggleButton = screen.getByRole('button', { name: /collapse sidebar/i })
    fireEvent.click(toggleButton)

    expect(mockOnToggle).toHaveBeenCalledTimes(1)
  })

  test('shows training badge when not collapsed', () => {
    render(
      <SidebarWrapper>
        <Sidebar collapsed={false} onToggle={mockOnToggle} />
      </SidebarWrapper>
    )

    expect(screen.getByText('3')).toBeInTheDocument()
  })


  test('navigation links have correct href attributes', () => {
    render(
      <SidebarWrapper>
        <Sidebar collapsed={false} onToggle={mockOnToggle} />
      </SidebarWrapper>
    )

    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /training/i })).toHaveAttribute('href', '/training')
    expect(screen.getByRole('link', { name: /checklists/i })).toHaveAttribute('href', '/checklists')
    expect(screen.getByRole('link', { name: /reports/i })).toHaveAttribute('href', '/reports')
    expect(screen.getByRole('link', { name: /settings/i })).toHaveAttribute('href', '/settings')
  })

  test('has proper keyboard navigation support', () => {
    render(
      <SidebarWrapper>
        <Sidebar collapsed={false} onToggle={mockOnToggle} />
      </SidebarWrapper>
    )

    const toggleButton = screen.getByRole('button', { name: /collapse sidebar/i })
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i })

    // Should be focusable
    toggleButton.focus()
    expect(toggleButton).toHaveFocus()

    dashboardLink.focus()
    expect(dashboardLink).toHaveFocus()
  })

  test('applies custom className when provided', () => {
    const customClass = 'custom-sidebar'
    render(
      <SidebarWrapper>
        <Sidebar collapsed={false} onToggle={mockOnToggle} className={customClass} />
      </SidebarWrapper>
    )

    const sidebar = screen.getByRole('button', { name: /collapse sidebar/i }).closest('div')?.parentElement
    expect(sidebar).toHaveClass(customClass)
  })
}) 
