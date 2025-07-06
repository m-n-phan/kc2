import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, expect, vi } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'
import 'fake-indexeddb/auto'

// Extend Vitest's expect with Testing Library matchers
expect.extend(matchers)

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// fake-indexeddb polyfill provides IDB APIs in Node environment

// @ts-ignore - Mock for testing
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

// @ts-ignore - Mock for testing  
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock window.matchMedia for responsive components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
}) 
