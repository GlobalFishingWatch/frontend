# apps/platform/vite.config.ts · [[platform-vite-configuration]]

Vite configuration file that defines build settings, plugins, chunk splitting, and caching rules for the platform application.

- staticRouteRules · function · L25-L34 — Generates cache headers for static routes based on build mode, applying immutable long-lived cache for production and no-cache for development.
- hotUpdate · method · L81-L86 — Triggers a full page reload when deck-layers source files change during development, bypassing normal hot module replacement.
- manualChunks · method · L154-L179 — Splits the bundle into optimized chunks by isolating icons, Redux, es-toolkit, and jsts dependencies into separate vendor bundles.
