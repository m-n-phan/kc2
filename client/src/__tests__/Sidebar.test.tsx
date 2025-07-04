import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('Sidebar', () => {
  test('renders navigation items and footer', () => {
    render(
      <Wrapper>
        <Sidebar />
      </Wrapper>
    )

    expect(screen.getByText('KitchenCoach')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Training')).toBeInTheDocument()
    expect(screen.getByText('Checklists')).toBeInTheDocument()
    expect(screen.getByText('Reports')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('Version 2.0.0')).toBeInTheDocument()
  })

  test('navigation links have correct href attributes', () => {
    render(
      <Wrapper>
        <Sidebar />
      </Wrapper>
    )

    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /training/i })).toHaveAttribute('href', '/training')
    expect(screen.getByRole('link', { name: /checklists/i })).toHaveAttribute('href', '/checklists')
    expect(screen.getByRole('link', { name: /reports/i })).toHaveAttribute('href', '/reports')
    expect(screen.getByRole('link', { name: /settings/i })).toHaveAttribute('href', '/settings')
  })

  test('shows training badge', () => {
    render(
      <Wrapper>
        <Sidebar />
      </Wrapper>
    )

    expect(screen.getByText('3')).toBeInTheDocument()
  })

  test('links are focusable', () => {
    render(
      <Wrapper>
        <Sidebar />
      </Wrapper>
    )

    const dashboardLink = screen.getByRole('link', { name: /dashboard/i })
    dashboardLink.focus()
    expect(dashboardLink).toHaveFocus()
  })

  test('applies custom className when provided', () => {
    const customClass = 'custom-sidebar'
    const { container } = render(
      <Wrapper>
        <Sidebar className={customClass} />
      </Wrapper>
    )

    const sidebar = container.firstChild as HTMLElement
    expect(sidebar).toHaveClass(customClass)
  })
})
