# KitchenCoach Client

This React application is configured with React Query for data fetching and a small utility for offline support.

## Offline Support

`src/utils/offline.ts` contains helpers that persist queued API requests and the React Query cache using IndexedDB. When the browser is offline, mutation calls are stored in the `requests` object store. A service worker processes the queue using the Background Sync API when connectivity returns so requests are reliably sent even if the app isn't open.

The exported `idbPersister` is passed to `PersistQueryClientProvider` so cached queries are persisted across reloads. Call `initializeOfflineSync()` early in your app to register the service worker sync handler and to notify it when the browser goes back online.

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

### Background Sync

When a mutation is queued while offline, the app registers a Background Sync request with the service worker. The service worker listens for this event and processes all queued requests, ensuring data is sent to the server as soon as connectivity is restored. If the browser does not support Background Sync, the requests are replayed the next time the app loads while online.

## PWA Service Worker

The application uses `vite-plugin-pwa` to generate a service worker (`src/sw.ts`). API
requests to `/api/*` are cached with a network-first strategy while static
assets are cached using a cache-first policy. The service worker is registered
automatically in `src/main.tsx`.

### Offline Testing

1. Run `npm run build --workspace=client` to generate the production build.
2. Serve the `dist` directory with `npm run preview --workspace=client`.
3. Open the app in your browser and then enable offline mode in dev tools.
4. Navigate previously visited pages to confirm they load from cache.
