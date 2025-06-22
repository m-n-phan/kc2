import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Button } from '../components/Button'

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Default Button</Button>)
    const button = screen.getByRole('button', { name: 'Default Button' })
    
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-primary')
    expect(button).toHaveClass('px-4', 'py-2')
    expect(button).toHaveAttribute('type', 'button')
  })

  it('renders primary variant correctly', () => {
    render(<Button variant="primary">Primary Button</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toHaveClass('bg-primary', 'text-white')
    expect(button).toHaveClass('focus:ring-primary/50')
  })

  it('renders secondary variant correctly', () => {
    render(<Button variant="secondary">Secondary Button</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toHaveClass('bg-slate-200', 'text-slate-700')
    expect(button).toHaveClass('focus:ring-slate-500/50')
  })

  it('renders ghost variant correctly', () => {
    render(<Button variant="ghost">Ghost Button</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toHaveClass('bg-transparent', 'text-slate-700')
    expect(button).toHaveClass('focus:ring-slate-500/50')
  })

  it('renders small size correctly', () => {
    render(<Button size="sm">Small Button</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm')
    expect(button).toHaveClass('min-h-[32px]')
  })

  it('renders medium size correctly', () => {
    render(<Button size="md">Medium Button</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toHaveClass('px-4', 'py-2', 'text-[16px]')
    expect(button).toHaveClass('min-h-[40px]')
  })

  it('renders large size correctly', () => {
    render(<Button size="lg">Large Button</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toHaveClass('px-6', 'py-3', 'text-lg')
    expect(button).toHaveClass('min-h-[44px]')
  })

  it('handles disabled state correctly', () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toBeDisabled()
    expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed')
    expect(button).toHaveAttribute('aria-disabled', 'true')
  })

  it('handles loading state correctly', () => {
    render(<Button loading>Loading Button</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toBeDisabled()
    expect(button).toHaveClass('cursor-wait')
    expect(button).toHaveAttribute('aria-disabled', 'true')
    
    // Should have loading spinner
    const spinner = button.querySelector('svg')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveClass('animate-spin')
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Clickable Button</Button>)
    const button = screen.getByRole('button')
    
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not handle click when disabled', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick} disabled>Disabled Button</Button>)
    const button = screen.getByRole('button')
    
    fireEvent.click(button)
    
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('does not handle click when loading', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick} loading>Loading Button</Button>)
    const button = screen.getByRole('button')
    
    fireEvent.click(button)
    
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('handles focus correctly', () => {
    render(<Button>Focusable Button</Button>)
    const button = screen.getByRole('button')
    
    button.focus()
    
    expect(button).toHaveFocus()
    expect(button).toHaveClass('focus:outline-none')
    expect(button).toHaveClass('focus:ring-2')
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom Button</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toHaveClass('custom-class')
    expect(button).toHaveClass('btn-base') // Still has base classes
  })

  it('forwards ref correctly', () => {
    const ref = vi.fn()
    render(<Button ref={ref}>Ref Button</Button>)
    
    expect(ref).toHaveBeenCalled()
  })

  it('has proper accessibility attributes', () => {
    render(<Button aria-label="Custom label">Accessible Button</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toHaveClass('touch-target')
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute('aria-label', 'Custom label')
  })

  it('supports all button HTML attributes', () => {
    render(
      <Button 
        type="submit" 
        form="test-form"
        aria-label="Submit form"
        data-testid="submit-button"
      >
        Submit
      </Button>
    )
    const button = screen.getByRole('button')
    
    expect(button).toHaveAttribute('type', 'submit')
    expect(button).toHaveAttribute('form', 'test-form')
    expect(button).toHaveAttribute('aria-label', 'Submit form')
    expect(button).toHaveAttribute('data-testid', 'submit-button')
  })

  it('shows loading text with proper opacity', () => {
    render(<Button loading>Loading Text</Button>)
    
    const textSpan = screen.getByText('Loading Text')
    expect(textSpan).toHaveClass('opacity-70')
  })

  it('shows normal text without opacity when not loading', () => {
    render(<Button>Normal Text</Button>)
    
    const textSpan = screen.getByText('Normal Text')
    expect(textSpan).not.toHaveClass('opacity-70')
  })

  it('prioritizes loading over disabled', () => {
    render(<Button loading disabled>Priority Test</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toBeDisabled()
    expect(button).toHaveClass('cursor-wait')
    expect(button).toHaveAttribute('aria-disabled', 'true')
  })

  it('has proper touch target size', () => {
    render(<Button size="sm">Small Touch Target</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toHaveClass('touch-target')
    expect(button).toHaveClass('min-h-[32px]')
  })

  it('supports custom type attribute', () => {
    render(<Button type="reset">Reset Button</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toHaveAttribute('type', 'reset')
  })
}) 
