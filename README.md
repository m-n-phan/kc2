# KitchenCoach 2.0

This monorepo contains the web client, server API and shared utilities for the KitchenCoach 2.0 platform.

## Getting Started

Install dependencies from the root of the repository:

```bash
npm ci
```

During development you can start both the client and server with:

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

## Environment Variables

The API server requires several environment variables. Create a `.env` file in the repository root and define the following values:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port for the Express server | `3001` |
| `CLIENT_URL` | Allowed origin for CORS requests | `http://localhost:5173` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://dev:dev@localhost:5432/kitchencoach_dev` |
| `NODE_ENV` | Node environment (development/production) | `development` |

Other features such as email or SMS integrations may require additional variables which will be documented alongside those features.

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

