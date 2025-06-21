import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { 
  Dashboard, 
  Training, 
  Checklists, 
  Reports, 
  Settings, 
  NotFound 
} from './pages'
// import { ModuleEditor } from './pages/training/ModuleEditor' // Removed - using modal instead

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: 'training',
        element: <Training />
      },
      // {
      //   path: 'training/new', 
      //   element: <ModuleEditor />
      // }, // Removed - using modal dialog instead
      {
        path: 'checklists',
        element: <Checklists />
      },
      {
        path: 'reports',
        element: <Reports />
      },
      {
        path: 'settings',
        element: <Settings />
      }
    ]
  }
])

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />
} 