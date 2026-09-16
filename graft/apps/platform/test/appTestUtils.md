# apps/platform/test/appTestUtils.tsx · [[test-infrastructure-and-utilities]]

- AppRenderOptions · interface · L24-L28 — Extension of vitest render options allowing test code to inject a Redux store, Jotai store, and authentication configuration.
- buildInitialHref · function · L30-L37 — Constructs the initial browser URL from location state, handling path basename normalization and query stringification.
- seedBrowserHistory · function · L39-L42 — Prepopulates browser history with the test's desired initial URL to prevent router initialization from overwriting fixture state.
- withGuestUser · function · L44-L47 — Configures a store with a guest user identity for testing unauthenticated app flows.
- render · function · L49-L111 — Renders the app in a test environment with configured stores, router, and optional authentication, seeding history to preserve test fixture state.
- Wrapper · function · L99-L101 — Wraps child components with Jotai provider to inject test store state into the component tree.
