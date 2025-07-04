# KitchenCoach 2.0 Monorepo

This repository contains the web client, server API and shared utilities for the KitchenCoach 2.0 platform. KitchenCoach 2.0 is a restaurant training, safety, and compliance platform delivered as a responsive web application and iPad PWA.

## Prerequisites

- Node.js >=18
- npm >=9

## Getting Started

Install all workspace dependencies from the repository root:

```bash
npm ci
```

The `npm ci` (or `npm install`) command requires network access to the npm registry
unless you have cached dependencies locally. Make sure the environment can reach
the registry or restore a local cache before running it.

Run `npm ci` or `npm install` before executing `npm test` or `npm run lint`. The
**vitest** and **eslint** packages used by these scripts live inside each
workspace's `node_modules` directory and are not available until the install step
completes.

During development you can start both the client and server with:

```bash
npm run dev
```

After installing, you can run linting and tests from the repository root:

```bash
npm run lint     # Lints client and server workspaces
npm test         # Runs tests for all workspaces
```

## Environment Variables

The API server requires several environment variables. Create a `.env` file in the repository root and define the following values:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port for the Express server | `3001` |
| `CLIENT_URL` | Allowed origin for CORS requests | `http://localhost:5173` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://dev:dev@localhost:5432/kitchencoach_dev` |
| `JWT_SECRET` | Secret key for signing JSON Web Tokens | *(none)* |
| `NODE_ENV` | Node environment (development/production) | `development` |
| `S3_ENDPOINT` | S3/MinIO endpoint | `http://localhost:9000` |
| `S3_REGION` | S3 region | `us-east-1` |
| `S3_ACCESS_KEY` | S3 access key | `minio` |
| `S3_SECRET_KEY` | S3 secret key | `minio123` |
| `S3_BUCKET` | Bucket for uploads | `uploads` |

Additional email/SMS integrations require:
| Variable | Description |
|----------|-------------|
| `SMTP_HOST` | SMTP server host |
| `SMTP_PORT` | SMTP port |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password |
| `TWILIO_SID` | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `TWILIO_FROM_NUMBER` | Phone number used for sending SMS |
| `TWILIO_TO_NUMBER` | destination phone number for SMS tests |

The server will throw an error during startup if `JWT_SECRET` is not defined.

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

## Docker Compose

The repository includes a `docker-compose.yml` file for running supporting
services used by the API. Start the stack with:

```bash
docker compose up -d
```

This launches a Postgres 15 database and a MinIO instance with credentials that
match the defaults referenced in the server configuration. Shut everything down
with `docker compose down` when finished.

## Design System

Details about the component library and design system can be found in [`client/src/components/README.md`](client/src/components/README.md).
