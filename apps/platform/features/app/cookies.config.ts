/**
 * Cookie keys shared between the app, the server functions and the e2e suite.
 *
 * Deliberately a leaf module with no imports and no `import.meta`: `features/app/app.config` reads
 * `import.meta.env` and calls `getComputedStyle` at module scope, so it can only be loaded by the
 * app itself. Playwright's CJS transform rejects `import.meta` outright, which broke the whole e2e
 * suite when it imported these constants from there.
 */
export const PANEL_WIDTHS_COOKIE_KEY = 'panelWidths'
export type PanelWidths = { sidebar?: number; contentPanel?: number; screen?: number }

// Access token: JS-readable (client builds Bearer headers from it; SSR reads it from the request).
export const USER_TOKEN_COOKIE_KEY = 'GFW_API_USER_TOKEN'
// Refresh token: httpOnly (only the auth server functions touch it).
export const USER_REFRESH_TOKEN_COOKIE_KEY = 'GFW_API_REFRESH_TOKEN'
