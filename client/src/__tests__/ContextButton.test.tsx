import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ContextButton } from '../components/ContextButton'
import { UserProvider } from '../context/UserContext'

// Mock component wrapper with UserProvider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <UserProvider>{children}</UserProvider>
)

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: query.includes('768px') ? false : true, // Default to desktop
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

describe('ContextButton', () => {
  it('renders text "Limegreen – Manager"', () => {
    render(
      <TestWrapper>
        <ContextButton />
      </TestWrapper>
    )
    
    expect(screen.getByText('Limegreen – Manager')).toBeInTheDocument()
  })

  it('opens menu on click, closes on outside click', async () => {
    render(
      <TestWrapper>
        <ContextButton />
      </TestWrapper>
    )
    
    const button = screen.getByRole('button', { name: /current context/i })
    
    // Menu should not be visible initially
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    
    // Click to open menu
    fireEvent.click(button)
    
    // Menu should be visible
    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument()
    })
    
    // Click outside to close
    fireEvent.mouseDown(document.body)
    
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })
  })

  it('selecting a new location calls setLocation', async () => {
    render(
      <TestWrapper>
        <ContextButton />
      </TestWrapper>
    )
    
    const button = screen.getByRole('button', { name: /current context/i })
    
    // Open menu
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument()
    })
    
    // Click on Riverside location
    const riversideOption = screen.getByRole('menuitemradio', { name: 'Riverside' })
    fireEvent.click(riversideOption)
    
    // Menu should close and context should update
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
      expect(screen.getByText('Riverside – Manager')).toBeInTheDocument()
    })
  })

  it('does not allow role switching (roles are permission-based)', async () => {
    render(
      <TestWrapper>
        <ContextButton />
      </TestWrapper>
    )
    
    const button = screen.getByRole('button', { name: /current context/i })
    
    // Open menu
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument()
    })
    
    // Should not have role selection options
    expect(screen.queryByText('ROLES')).not.toBeInTheDocument()
    expect(screen.queryByRole('menuitemradio', { name: 'Team Member' })).not.toBeInTheDocument()
    expect(screen.queryByRole('menuitemradio', { name: 'Manager' })).not.toBeInTheDocument()
    
    // Role should remain unchanged (Manager is default)
    expect(screen.getByText('Limegreen – Manager')).toBeInTheDocument()
  })

  it('shows responsive text based on screen size', () => {
    const { container } = render(
      <TestWrapper>
        <ContextButton />
      </TestWrapper>
    )

    // Check that all responsive spans exist
    const mobileSpan = container.querySelector('.md\\:hidden')
    const tabletSpan = container.querySelector('.hidden.md\\:inline.lg\\:hidden')
    const desktopSpan = container.querySelector('.hidden.lg\\:inline')
    
    expect(mobileSpan).toBeInTheDocument()
    expect(tabletSpan).toBeInTheDocument()
    expect(desktopSpan).toBeInTheDocument()
    
    // Mobile should show abbreviated text (LM for Limegreen Manager)
    expect(mobileSpan).toHaveTextContent('LM')
    // Tablet should show location only
    expect(tabletSpan).toHaveTextContent('Limegreen')
    // Desktop should show full text
    expect(desktopSpan).toHaveTextContent('Limegreen – Manager')
    
    // All should have tooltips for accessibility
    expect(mobileSpan).toHaveAttribute('title', 'Limegreen – Manager')
    expect(tabletSpan).toHaveAttribute('title', 'Limegreen – Manager')
    expect(desktopSpan).toHaveAttribute('title', 'Limegreen – Manager')
  })

  it('shows "Manage Locations…" link only for Manager role', async () => {
    render(
      <TestWrapper>
        <ContextButton />
      </TestWrapper>
    )
    
    const button = screen.getByRole('button', { name: /current context/i })
    
    // Open menu (default role is Manager)
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument()
    })
    
    // Should show "Manage Locations…" for Manager role
    expect(screen.getByText('Manage Locations…')).toBeInTheDocument()
    
    // Note: Can't test Team Member scenario since roles are no longer user-switchable
    // In real app, this would be tested with different user contexts
  })

  it('closes menu on Escape key', async () => {
    render(
      <TestWrapper>
        <ContextButton />
      </TestWrapper>
    )
    
    const button = screen.getByRole('button', { name: /current context/i })
    
    // Open menu
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument()
    })
    
    // Press Escape
    fireEvent.keyDown(button, { key: 'Escape' })
    
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })
  })

  it('has proper accessibility attributes', () => {
    render(
      <TestWrapper>
        <ContextButton />
      </TestWrapper>
    )
    
    const button = screen.getByRole('button', { name: /current context/i })
    
    expect(button).toHaveAttribute('aria-haspopup', 'menu')
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveAttribute('aria-label', 'Current context: Limegreen – Manager')
  })
}) 
