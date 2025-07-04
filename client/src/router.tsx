import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { Dashboard, Training, TrainingAssignments, TrainingModuleView, Checklists, RunChecklist, Reports, Settings, NotFound, Register, ResetPassword, Login } from './pages'
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
      {
        path: 'training/assignments',
        element: <TrainingAssignments />
      },
      {
        path: 'training/modules/:id',
        element: <TrainingModuleView />
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
        path: 'checklists/run/:id',
        element: <RunChecklist />
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
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/reset-password',
    element: <ResetPassword />
  },
  {
    path: '/login',
    element: <Login />
  }
])

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />
} 
