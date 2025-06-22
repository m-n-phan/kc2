# KitchenCoach 2.0 Component Library

A comprehensive design system built for the KitchenCoach 2.0 restaurant training, safety, and compliance platform.

## Overview

This component library provides reusable, accessible, and consistent UI components following the design specifications outlined in the PRD. All components are built with TypeScript, thoroughly tested, and documented with Storybook.

## Design Principles

- **Accessibility First**: All components meet WCAG 2.1 AA standards
- **Mobile-Ready**: Touch-friendly targets (≥44px) and responsive design
- **Type Safety**: Full TypeScript support with comprehensive interfaces
- **Performance**: Optimized for fast rendering and minimal bundle impact

## Components

### Button
A flexible button component with multiple variants and sizes.

**Variants**: `primary` | `secondary` | `ghost`  
**Sizes**: `sm` | `md` | `lg`

```tsx
import { Button } from './Button'

<Button variant="primary" size="md">
  Click me
</Button>
```

### Card
A versatile container component for grouping related content.

**Props**: `hover` (boolean) - enables/disables hover effects

```tsx
import { Card } from './Card'

<Card className="p-6">
  <h3>Card Title</h3>
  <p>Card content goes here...</p>
</Card>
```

### Badge
Status indicator component for displaying states and categories.

**Variants**: `default` | `success` | `warning` | `error`

```tsx
import { Badge } from './Badge'

<Badge variant="success">Active</Badge>
```

### KpiTile
Dashboard component for displaying key performance indicators with trend visualization.

**Trends**: `up` | `down` | `neutral`

```tsx
import { KpiTile } from './KpiTile'

<KpiTile
  title="Training Completion"
  value="94%"
  change="+5%"
  trend="up"
/>
```

### IconWrapper
Consistent icon container with styling variants.

**Variants**: `default` | `filled`  
**Sizes**: `sm` | `md` | `lg`

```tsx
import { IconWrapper } from './IconWrapper'
import { Heart } from 'lucide-react'

<IconWrapper variant="filled" size="md">
  <Heart className="h-5 w-5" />
</IconWrapper>
```

## Naming Conventions

### Component Names
- **PascalCase** for component names: `Button`, `KpiTile`, `IconWrapper`
- **Descriptive**: Names clearly indicate component purpose
- **Consistent**: Follow established patterns (e.g., `Tile` suffix for dashboard widgets)

### File Structure
```
components/
├── Button.tsx          # Component implementation
├── Card.tsx           # Component implementation  
├── Badge.tsx          # Component implementation
├── KpiTile.tsx        # Component implementation
├── IconWrapper.tsx    # Component implementation
└── README.md          # This documentation
```

### Props Naming
- **camelCase** for all props: `variant`, `size`, `hover`
- **Boolean props**: Use positive names (`disabled` instead of `enabled`)
- **Variants**: Use descriptive strings (`primary`, `secondary`, `ghost`)

### CSS Classes
- **kebab-case** for utility classes: `btn-base`, `card-base`
- **Tailwind-first**: Prefer Tailwind utilities over custom CSS
- **Semantic naming**: Classes describe purpose, not appearance

## Storybook Setup

### Running Storybook
```bash
npm run storybook
```

### Story Structure
Each component has comprehensive stories demonstrating:
- **All variants** and combinations
- **Interactive states** (disabled, loading, etc.)
- **Real-world examples** with actual content
- **Responsive behavior** across devices

### Story Naming Convention
- **Main exports**: `Primary`, `Secondary`, `Ghost` (for variants)
- **Size examples**: `Small`, `Medium`, `Large`
- **State examples**: `Disabled`, `Loading`
- **Complex examples**: `AllVariants`, `RestaurantMetrics`

### Adding New Stories
1. Create `ComponentName.stories.tsx` in `/src/stories/`
2. Follow existing patterns for meta configuration
3. Include comprehensive prop documentation
4. Add real-world usage examples

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ComponentName } from '../components/ComponentName'

const meta = {
  title: 'Design System/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Component description here...',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ComponentName>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    // component props
  },
}
```

## Testing

### Test Coverage
All components maintain ≥90% test coverage including:
- **Rendering**: Default state and all variants
- **Interactions**: Click handlers, keyboard navigation
- **Accessibility**: Focus management, ARIA attributes
- **Props**: All prop combinations and edge cases

### Running Tests
```bash
npm run test                    # Run all tests
npm run test -- --coverage     # Run with coverage report
npm run test -- --watch        # Run in watch mode
```

### Test File Location
Tests are located in `/src/__tests__/ComponentName.test.tsx`

## TypeScript Integration

### Component Props
All components export their prop interfaces for reuse:

```tsx
import type { ButtonProps } from './components/Button'

// Use in your own components
interface CustomButtonProps extends ButtonProps {
  customProp?: string
}
```

### Ref Forwarding
All components support ref forwarding using `React.forwardRef`:

```tsx
const buttonRef = useRef<HTMLButtonElement>(null)

<Button ref={buttonRef}>Click me</Button>
```

## Contributing

### Adding New Components
1. Create component in `/src/components/ComponentName.tsx`
2. Add comprehensive TypeScript interfaces
3. Include Storybook stories in `/src/stories/`
4. Write tests achieving ≥90% coverage
5. Update this README with documentation

### Code Quality Standards
- **TypeScript**: Strict mode enabled, no `any` types
- **Linting**: ESLint rules enforced on commit
- **Testing**: Vitest + React Testing Library
- **Accessibility**: Test with screen readers and keyboard navigation

## Browser Support

- **Modern browsers**: Chrome 90+, Firefox 88+, Safari 14+
- **Mobile**: iOS Safari 14+, Chrome Android 90+
- **Accessibility**: Screen readers, keyboard navigation, high contrast

## Performance

- **Bundle size**: Each component is tree-shakeable
- **Runtime**: Minimal re-renders with React.memo where appropriate
- **CSS**: Tailwind utilities purged for production builds

---

For more detailed component documentation, explore the [Storybook documentation](http://localhost:6006) when running the development server. 
