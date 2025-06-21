import type { Meta, StoryObj } from '@storybook/react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'

const meta = {
  title: 'Design System/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile card container component with hover effects and flexible content support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    hover: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2">Card Title</h3>
        <p className="text-slate-600">This is a simple card with some content.</p>
      </div>
    ),
  },
}

export const WithoutHover: Story = {
  args: {
    hover: false,
    children: (
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2">Static Card</h3>
        <p className="text-slate-600">This card doesn't have hover effects.</p>
      </div>
    ),
  },
}

export const ProductCard: Story = {
  args: {
    children: (
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">Training Module</h3>
          <Badge variant="success">Active</Badge>
        </div>
        <p className="text-slate-600 mb-4">
          Learn proper food safety procedures and kitchen protocols.
        </p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-500">45 min duration</span>
          <Button size="sm">Start Training</Button>
        </div>
      </div>
    ),
  },
}

export const StatsCard: Story = {
  args: {
    children: (
      <div className="p-6 text-center">
        <div className="text-3xl font-bold text-primary mb-2">98%</div>
        <div className="text-sm font-medium text-slate-600 mb-1">Completion Rate</div>
        <div className="text-xs text-slate-500">Last 30 days</div>
      </div>
    ),
  },
}

export const CardGrid: Story = {
  args: {
    children: <div>Placeholder</div>
  },
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
      <Card className="p-4">
        <h4 className="font-semibold mb-2">Simple Card</h4>
        <p className="text-sm text-slate-600">Basic card content</p>
      </Card>
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold">Status Card</h4>
          <Badge variant="warning">Pending</Badge>
        </div>
        <p className="text-sm text-slate-600">Card with status badge</p>
      </Card>
      <Card className="p-4">
        <h4 className="font-semibold mb-2">Action Card</h4>
        <p className="text-sm text-slate-600 mb-3">Card with action button</p>
        <Button size="sm" variant="secondary">View Details</Button>
      </Card>
    </div>
  ),
} 