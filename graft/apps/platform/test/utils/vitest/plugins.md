# apps/platform/test/utils/vitest/plugins.ts · [[vite-test-infrastructure-plugins]]

Vite plugin configuration module that provides middleware for serving public assets with path rewriting and authentication tokens for browser tests.

- publicAssetsPlugin · function · L15-L37 — Creates a Vite plugin that strips the configured base path prefix from incoming requests to normalize asset URLs during dev and preview server execution.
- configureServer · method · L17-L26 — Registers middleware on the dev server to rewrite URLs starting with the base path to root-relative paths.
- configurePreviewServer · method · L27-L36 — Registers middleware on the preview server to rewrite URLs starting with the base path to root-relative paths.
- authTokensPlugin · function · L40-L80 — Creates a Vite plugin that serves authentication tokens from a local file to browser tests via a special endpoint, returning empty tokens if the file does not exist.
- configureServer · method · L42-L60 — Registers middleware on the dev server to intercept requests to the auth tokens endpoint and respond with tokens from disk or a default empty object.
- configurePreviewServer · method · L61-L79 — Registers middleware on the preview server to intercept requests to the auth tokens endpoint and respond with tokens from disk or a default empty object.
