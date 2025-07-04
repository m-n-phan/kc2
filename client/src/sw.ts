/* eslint-env serviceworker */
/* global ServiceWorkerGlobalScope */
import { precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { syncQueuedRequests } from './utils/offline'

/* global ServiceWorkerGlobalScope */

declare let self: ServiceWorkerGlobalScope

self.skipWaiting()
clientsClaim()
precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SYNC_QUEUE') {
    event.waitUntil(syncQueuedRequests())
  }
})

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-requests') {
    event.waitUntil(syncQueuedRequests())
  }
})
