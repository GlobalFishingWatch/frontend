# libs/deck-loaders/src/loaders.config.ts · [[environment-path-configuration]]

Configuration module that exports environment-aware utilities for managing base URL paths and accessing environment variables across Vite and Node.js runtimes.

- getEnv · function · L3-L11 — Retrieves environment variable values from Vite's import.meta.env or Node.js process.env with a fallback mechanism for missing keys.
