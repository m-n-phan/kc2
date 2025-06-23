import React, { useState } from 'react'
import { Button, Card } from '../components'

export const Settings: React.FC = () => {
  const [companyName, setCompanyName] = useState('KitchenCoach')
  const [email, setEmail] = useState('admin@example.com')
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, save settings here
    alert('Settings saved')
  }

  return (
    <div className="space-y-section">
      <div>
        <h1 className="text-h1 text-charcoal mb-2">Settings</h1>
        <p className="text-slate-600">Manage application preferences</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="company" className="block text-sm font-medium mb-1">Company Name</label>
            <input
              id="company"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Admin Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="notifications"
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="h-4 w-4 border-slate-300 rounded"
            />
            <label htmlFor="notifications" className="text-sm text-slate-700">Enable notifications</label>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="darkmode"
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
              className="h-4 w-4 border-slate-300 rounded"
            />
            <label htmlFor="darkmode" className="text-sm text-slate-700">Use dark mode</label>
          </div>

          <div className="text-right">
            <Button type="submit">Save Settings</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
