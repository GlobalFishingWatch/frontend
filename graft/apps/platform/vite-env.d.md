# apps/platform/vite-env.d.ts · [[platform-environment-types]]

TypeScript declaration file that extends Vite and ImportMeta types to define environment variables and build-time injections for the platform application.

- ImportMetaEnv · interface · L7-L26 — Interface that declares all Vite environment variables and configuration flags accessible at runtime through import.meta.env.
- ImportMeta · interface · L28-L30 — Interface that augments the ImportMeta global to expose typed environment variables through the env property.
