/* global BodyInit */
import { openDB, type DBSchema } from 'idb'
import type {
  Persister,
  PersistedClient,
} from '@tanstack/query-persist-client-core'

import type { Persister, PersistedClient } from '@tanstack/query-persist-client-core'

interface OfflineDB extends DBSchema {
  requests: {
    key: string
    value: OfflineRequest
  }
  query: {
    key: string
    value: PersistedClient
  }
}

export interface OfflineRequest {
  id: string
  url: string
  method: string
  body?: BodyInit
  headers?: Record<string, string>
}

const dbPromise = openDB<OfflineDB>('kc2-offline', 1, {
  upgrade(db) {
    db.createObjectStore('requests', { keyPath: 'id' })
    db.createObjectStore('query')
  },
})

export const idbPersister: Persister = {
  async persistClient(client) {
    const db = await dbPromise
    await db.put('query', client, 'client')
  },
  async restoreClient() {
    const db = await dbPromise
    return db.get('query', 'client')
  },
  async removeClient() {
    const db = await dbPromise
    await db.delete('query', 'client')
  },
}

export async function queueRequest(req: OfflineRequest) {
  const db = await dbPromise
  await db.put('requests', req)

  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready
      await registration.sync.register('sync-requests')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Background sync registration failed', err)
    }
  }
}

export async function getQueuedRequests(): Promise<OfflineRequest[]> {
  const db = await dbPromise
  return db.getAll('requests')
}

export async function removeQueuedRequest(id: string) {
  const db = await dbPromise
  await db.delete('requests', id)
}

export async function syncQueuedRequests() {
  if (!navigator.onLine) return
  const db = await dbPromise
  const requests = await db.getAll('requests')
  for (const req of requests) {
    try {
      await fetch(req.url, {
        method: req.method,
        headers: req.headers,
        body: req.body as unknown,
      } as Parameters<typeof fetch>[1])
      await db.delete('requests', req.id)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to sync request', err)
    }
  }
}

export function initializeOfflineSync() {
  const triggerSync = () => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SYNC_QUEUE' })
    } else {
      void syncQueuedRequests()
    }
  }

  window.addEventListener('online', triggerSync)

  if (navigator.onLine) {
    triggerSync()
  }
}
