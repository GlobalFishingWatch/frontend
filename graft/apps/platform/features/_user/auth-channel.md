# apps/platform/features/_user/auth-channel.ts · [[cross-tab-authentication-sync]]

Exports authentication channel constants, popup management, and cross-tab message broadcasting utilities for login/logout synchronization.

- openAuthPopup · function · L17-L36 — Opens a centered authentication popup window and registers it for automatic closure on page hide.
- AuthChannelMessage · type · L38-L39 — Defines the union type for authentication broadcast messages, supporting both login with user data and logout with sender identification.
- postAuthMessage · function · L41-L46 — Posts an authentication message through BroadcastChannel to synchronize auth state across browser tabs.
- broadcastLogin · function · L48-L50 — Broadcasts a login success message with user data across all tabs via the auth channel.
- broadcastLogout · function · L52-L54 — Broadcasts a logout message with the current tab's ID to allow other tabs to distinguish their own logout echo.
