# libs/api-client/src/utils/env.ts · [[environment-resolution]] [[isomorphic-code-patterns-for-ssr]]

Module that provides a function to retrieve environment variables from Vite, Node.js process, or a fallback value.

- getEnv · function · L3-L15 — Resolves an environment variable by checking Vite's import.meta.env first, then process.env as a fallback, returning a provided default if neither source has the key.
