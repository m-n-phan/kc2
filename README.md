# KitchenCoach 2.0

This monorepo contains the web client, server API and shared utilities for the KitchenCoach 2.0 platform.

## Getting Started

Install dependencies from the root of the repository:

```bash
npm ci
```

During development you can start both the client and server with:

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
