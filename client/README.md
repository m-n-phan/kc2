# KitchenCoach Client

This React application is configured with React Query for data fetching and a small utility for offline support.

## Offline Support

`src/utils/offline.ts` contains helpers that persist queued API requests and the React Query cache using IndexedDB. When the browser is offline, mutation calls are stored in the `requests` object store. Once connectivity is restored they are automatically replayed.

The exported `idbPersister` is passed to `PersistQueryClientProvider` so cached queries are persisted across reloads. Call `initializeOfflineSync()` early in your app to start listening for the `online` event.

### Basic usage

```tsx
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { initializeOfflineSync, idbPersister } from './utils/offline'

const queryClient = new QueryClient()
initializeOfflineSync()

function App() {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: idbPersister }}>
      {/* ... */}
    </PersistQueryClientProvider>
  )
}
```

Queued requests will be synced automatically once the user is back online.

## PWA Service Worker

The application uses `vite-plugin-pwa` to generate a service worker. API
requests to `/api/*` are cached with a network-first strategy while static
assets are cached using a cache-first policy. The service worker is registered
automatically in `src/main.tsx`.

### Offline Testing

1. Run `npm run build --workspace=client` to generate the production build.
2. Serve the `dist` directory with `npm run preview --workspace=client`.
3. Open the app in your browser and then enable offline mode in dev tools.
4. Navigate previously visited pages to confirm they load from cache.
