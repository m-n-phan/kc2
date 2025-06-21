/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, ReactNode } from 'react'

/* eslint-disable @typescript-eslint/no-unused-vars */
export interface UserContextType {
  location: string
  role: string
  setLocation: (value: string) => void
  // Note: role is read-only, determined by user permissions/authentication
  // Users can switch locations but not roles for security reasons
}
/* eslint-enable @typescript-eslint/no-unused-vars */

export const UserContext = createContext<UserContextType | undefined>(undefined)

export interface UserProviderProps {
  children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [location, setLocation] = useState('Limegreen')
  const [role] = useState('Manager') // Role is read-only, determined by user permissions

  const value: UserContextType = {
    location,
    role,
    setLocation,
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

 