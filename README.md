# KitchenCoach 2.0

## Overview

KitchenCoach 2.0 is a restaurant training, safety, and compliance platform delivered as a responsive web application and iPad PWA.

## Prerequisites

- Node.js >=18
- npm >=9

## Getting Started

Install all dependencies from the repository root:

```bash
npm install
```

Start both the client and server in development mode:

```bash
npm run dev
```

To run the client or server individually, use `npm run dev:client` or `npm run dev:server`.

Build both applications for production:

```bash
npm run build
```

Run the test suite:

```bash
npm run test
```

Lint all workspaces:

```bash
npm run lint
```

## Root Scripts

The root `package.json` exposes several scripts:

| Script | Description |
| --- | --- |
| `dev` | Starts client and server concurrently. |
| `build` | Builds the client and server applications. |
| `test` | Runs tests for all workspaces. |
| `lint` | Runs ESLint for the client and server. |

See `package.json` for additional scripts such as `dev:client`, `dev:server`, and more.

## Design System

Details about the component library and design system can be found in [`client/src/components/README.md`](client/src/components/README.md).

