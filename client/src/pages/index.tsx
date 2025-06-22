import React from 'react'

// Page Components
export { Dashboard } from './Dashboard'
export { Training } from './Training'

// Placeholder pages for navigation
export const Checklists: React.FC = () => (
  <div className="p-8 text-center">
    <h1 className="text-h1 text-charcoal mb-4">Checklists</h1>
    <p className="text-slate-600">Checklist management coming in Chunk 3</p>
  </div>
)

export const Reports: React.FC = () => (
  <div className="p-8 text-center">
    <h1 className="text-h1 text-charcoal mb-4">Reports</h1>
    <p className="text-slate-600">Reporting dashboard coming in Chunk 4</p>
  </div>
)

export const Settings: React.FC = () => (
  <div className="p-8 text-center">
    <h1 className="text-h1 text-charcoal mb-4">Settings</h1>
    <p className="text-slate-600">Settings management coming in future chunks</p>
  </div>
)

export const NotFound: React.FC = () => (
  <div className="p-8 text-center">
    <h1 className="text-h1 text-charcoal mb-4">404 - Page Not Found</h1>
    <p className="text-slate-600">The page you're looking for doesn't exist.</p>
  </div>
) 
