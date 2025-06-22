import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Card } from '../components/Card'

describe('Card', () => {
  it('renders with default props', () => {
    render(
      <Card data-testid="test-card">
        <div>Card Content</div>
      </Card>
    )
    const card = screen.getByTestId('test-card')
    
    expect(card).toBeInTheDocument()
    expect(card).toHaveClass('card-base')
    expect(card).toHaveClass('hover:shadow-md')
    expect(card).not.toHaveAttribute('role')
    expect(card).not.toHaveAttribute('tabIndex')
  })

  it('renders children correctly', () => {
    render(
      <Card>
        <h2>Card Title</h2>
        <p>Card description</p>
      </Card>
    )
    
    expect(screen.getByText('Card Title')).toBeInTheDocument()
    expect(screen.getByText('Card description')).toBeInTheDocument()
  })

  it('applies hover effect by default', () => {
    render(<Card data-testid="hoverable-card">Hoverable Card</Card>)
    const card = screen.getByTestId('hoverable-card')
    
    expect(card).toHaveClass('hover:shadow-md')
    expect(card).toHaveClass('transition-shadow')
  })

  it('disables hover effect when hover prop is false', () => {
    render(<Card hover={false} data-testid="static-card">Static Card</Card>)
    const card = screen.getByTestId('static-card')
    
    expect(card).not.toHaveClass('hover:shadow-md')
    expect(card).toHaveClass('card-base')
  })

  it('applies custom className', () => {
    render(<Card className="custom-card" data-testid="custom-card">Custom Card</Card>)
    const card = screen.getByTestId('custom-card')
    
    expect(card).toHaveClass('custom-card')
    expect(card).toHaveClass('card-base')
  })

  it('forwards ref correctly', () => {
    const ref = vi.fn()
    render(<Card ref={ref}>Ref Card</Card>)
    
    expect(ref).toHaveBeenCalled()
  })

  it('becomes interactive when onClick is provided', () => {
    const handleClick = vi.fn()
    render(
      <Card onClick={handleClick} data-testid="interactive-card">
        Interactive Card
      </Card>
    )
    const card = screen.getByTestId('interactive-card')
    
    expect(card).toHaveAttribute('role', 'button')
    expect(card).toHaveAttribute('tabIndex', '0')
    expect(card).toHaveClass('cursor-pointer')
    expect(card).toHaveClass('focus:ring-2')
  })

  it('handles click events correctly', () => {
    const handleClick = vi.fn()
    render(
      <Card onClick={handleClick} data-testid="clickable-card">
        Clickable Card
      </Card>
    )
    const card = screen.getByTestId('clickable-card')
    
    fireEvent.click(card)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
    expect(handleClick).toHaveBeenCalledWith(expect.objectContaining({
      type: 'click'
    }))
  })

  it('handles keyboard events (Enter and Space)', () => {
    const handleClick = vi.fn()
    render(
      <Card onClick={handleClick} data-testid="keyboard-card">
        Keyboard Card
      </Card>
    )
    const card = screen.getByTestId('keyboard-card')
    
    // Test Enter key
    fireEvent.keyDown(card, { key: 'Enter' })
    expect(handleClick).toHaveBeenCalledTimes(1)
    
    // Test Space key
    fireEvent.keyDown(card, { key: ' ' })
    expect(handleClick).toHaveBeenCalledTimes(2)
    
    // Test other keys don't trigger click
    fireEvent.keyDown(card, { key: 'Escape' })
    expect(handleClick).toHaveBeenCalledTimes(2)
  })

  it('supports explicit interactive prop', () => {
    render(
      <Card interactive data-testid="explicit-interactive">
        Explicitly Interactive Card
      </Card>
    )
    const card = screen.getByTestId('explicit-interactive')
    
    expect(card).toHaveAttribute('role', 'button')
    expect(card).toHaveAttribute('tabIndex', '0')
    expect(card).toHaveClass('cursor-pointer')
  })

  it('supports all div HTML attributes', () => {
    render(
      <Card 
        id="test-card"
        data-testid="card-component"
        aria-label="Test card"
      >
        Card with attributes
      </Card>
    )
    const card = screen.getByTestId('card-component')
    
    expect(card).toHaveAttribute('id', 'test-card')
    expect(card).toHaveAttribute('aria-label', 'Test card')
  })

  it('renders complex content correctly', () => {
    render(
      <Card data-testid="complex-card">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2">Complex Card</h3>
          <p className="text-slate-600 mb-4">This is a more complex card example.</p>
          <button>Action Button</button>
        </div>
      </Card>
    )
    
    expect(screen.getByText('Complex Card')).toBeInTheDocument()
    expect(screen.getByText('This is a more complex card example.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument()
  })

  it('maintains proper styling hierarchy', () => {
    render(<Card className="p-4 border-2" data-testid="styled-card">Styled Card</Card>)
    const card = screen.getByTestId('styled-card')
    
    // Should have both base styles and custom styles
    expect(card).toHaveClass('card-base')
    expect(card).toHaveClass('p-4')
    expect(card).toHaveClass('border-2')
  })

  it('handles empty children gracefully', () => {
    render(<Card data-testid="empty-card">{null}</Card>)
    const card = screen.getByTestId('empty-card')
    
    expect(card).toBeInTheDocument()
    expect(card).toHaveClass('card-base')
  })

  it('combines hover and interactive states correctly', () => {
    const handleClick = vi.fn()
    render(
      <Card onClick={handleClick} hover={false} data-testid="interactive-no-hover">
        Interactive but no hover
      </Card>
    )
    const card = screen.getByTestId('interactive-no-hover')
    
    expect(card).toHaveAttribute('role', 'button')
    expect(card).not.toHaveClass('hover:shadow-md')
    expect(card).toHaveClass('cursor-pointer')
  })

  it('forwards custom onKeyDown handler', () => {
    const handleClick = vi.fn()
    const handleKeyDown = vi.fn()
    
    render(
      <Card onClick={handleClick} onKeyDown={handleKeyDown} data-testid="custom-keydown">
        Custom KeyDown
      </Card>
    )
    const card = screen.getByTestId('custom-keydown')
    
    fireEvent.keyDown(card, { key: 'Escape' })
    
    expect(handleKeyDown).toHaveBeenCalledTimes(1)
    expect(handleClick).not.toHaveBeenCalled()
  })
}) 
