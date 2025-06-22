import { useContext } from 'react'
import { UserContext, UserContextType } from '../context/UserContext'

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider')
  }
  return context
} 
