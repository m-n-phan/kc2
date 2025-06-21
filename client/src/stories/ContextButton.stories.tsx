import type { Meta, StoryObj } from '@storybook/react'
import { ContextButton } from '../components/ContextButton'
import { UserProvider } from '../context/UserContext'

const meta: Meta<typeof ContextButton> = {
  title: 'Navigation/ContextButton',
  component: ContextButton,
  decorators: [
    (Story) => (
      <UserProvider>
        <div className="p-4">
          <Story />
        </div>
      </UserProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A dropdown button for switching between locations and roles in the application header.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default context button showing "Limegreen – Manager" with dropdown menu.',
      },
    },
  },
}

export const WithCustomClass: Story = {
  args: {
    className: 'border border-dashed border-slate-300',
  },
  parameters: {
    docs: {
      description: {
        story: 'Context button with custom styling applied.',
      },
    },
  },
}

export const InHeader: Story = {
  decorators: [
    (Story) => (
      <UserProvider>
        <div className="w-full bg-white border-b border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">KC</span>
                </div>
                <span className="font-semibold text-gray-900">KitchenCoach</span>
              </div>
              <div className="w-px h-6 bg-slate-200" />
              <Story />
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-slate-500 hover:text-slate-700">
                🔔
              </button>
              <button className="p-2 text-slate-500 hover:text-slate-700">
                👤
              </button>
            </div>
          </div>
        </div>
      </UserProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Context button as it appears in the application header with logo and other elements.',
      },
    },
  },
} 