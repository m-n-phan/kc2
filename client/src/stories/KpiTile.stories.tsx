import type { Meta, StoryObj } from '@storybook/react'
import { KpiTile } from '../components/KpiTile'

const meta = {
  title: 'Design System/KpiTile',
  component: KpiTile,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'KPI tile component for displaying key performance indicators with trend visualization.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    trend: {
      control: { type: 'select' },
      options: ['up', 'down', 'neutral'],
    },
    loading: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof KpiTile>

export default meta
type Story = StoryObj<typeof meta>

export const TrendingUp: Story = {
  args: {
    title: 'Active Users',
    value: '1,247',
    change: '+12%',
    trend: 'up',
  },
}

export const TrendingDown: Story = {
  args: {
    title: 'Incident Reports',
    value: '3',
    change: '-40%',
    trend: 'down',
  },
}

export const Neutral: Story = {
  args: {
    title: 'Average Score',
    value: '85.5',
    change: '0%',
    trend: 'neutral',
  },
}

export const Loading: Story = {
  args: {
    title: 'Loading Data',
    value: '---',
    loading: true,
  },
}

export const WithoutChange: Story = {
  args: {
    title: 'Total Locations',
    value: '24',
  },
}

export const RestaurantMetrics: Story = {
  args: {
    title: "Restaurant Metrics",
    value: "Dashboard",
  },
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <KpiTile
        title="Training Completion"
        value="94%"
        change="+5%"
        trend="up"
      />
      <KpiTile
        title="Safety Score"
        value="98.2"
        change="+1.5"
        trend="up"
      />
      <KpiTile
        title="Checklist Compliance"
        value="89%"
        change="-2%"
        trend="down"
      />
      <KpiTile
        title="Active Staff"
        value="156"
        change="+8"
        trend="up"
      />
    </div>
  ),
} 
