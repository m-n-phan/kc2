# KitchenCoach 2.0 Monorepo

This repository contains the client and server packages for KitchenCoach 2.0.

## Getting Started

Install all workspace dependencies using `npm ci` before running any lint or test commands. Dependency versions are locked by `package-lock.json` and `npm ci` ensures a reproducible environment.

After installing, you can run linting and tests from the repository root:

```bash
npm run lint     # Lints client and server workspaces
npm test         # Runs tests for all workspaces
```

