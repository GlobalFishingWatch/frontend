# apps/data-download-portal/src/components/topBar/topBar.tsx · [[data-portal-header-auth]]

Renders a top navigation bar with conditional login/logout UI based on user authentication state.

- TopBarProps · interface · L11-L13 — Defines the optional children prop interface for the TopBar component.
- TopBar · function · L15-L56 — Renders a navigation bar that displays login prompt or logout option depending on authentication status and user state.
- handleLoginRedirect · function · L17-L21 — Redirects unauthenticated users to the GFW login page while preserving the current location.
