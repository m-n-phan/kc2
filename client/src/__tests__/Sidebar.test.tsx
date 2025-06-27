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

  test('applies custom className when provided', () => {
    const customClass = 'custom-sidebar'
    render(
      <Wrapper>
        <Sidebar className={customClass} />
      </Wrapper>
    )

    const sidebar = screen
      .getByText('KitchenCoach')
      .closest('div')
      ?.parentElement?.parentElement
    expect(sidebar).toHaveClass(customClass)
  })
})
