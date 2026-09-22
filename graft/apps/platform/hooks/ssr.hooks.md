# apps/platform/hooks/ssr.hooks.ts · [[server-side-rendering-ssr-safety-pattern]]

Module that exports a React hook to detect whether the application has been hydrated on the client side.

- subscribeToHydrationStore · function · L3-L5 — Provides an empty subscription unsubscriber for the hydration external store.
- getClientHydrationSnapshot · function · L7-L9 — Returns the hydration state snapshot for client-side execution indicating the app is hydrated.
- getServerHydrationSnapshot · function · L11-L13 — Returns the hydration state snapshot for server-side execution indicating the app is not yet hydrated.
- useIsClientHydrated · function · L15-L21 — React hook that returns true when the application has been hydrated on the client and false during server-side rendering.
