import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { AppRouter } from './router'
import { UserProvider } from './context/UserContext'
import { initializeOfflineSync, idbPersister } from './utils/offline'
import './styles/globals.css'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  initializeOfflineSync()

  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: idbPersister }}>
      <UserProvider>
        <AppRouter />
      </UserProvider>
    </PersistQueryClientProvider>
  )
}

export default App 
