# apps/platform/features/_user/user.hooks.ts · [[oauth-popup-login-token-handling]] [[user-authentication-session-management]] [[workspace-vessel-data-sync]]

Collection of React hooks for managing user authentication state, login/logout flows via popups and broadcast channels, and data reloading after authentication changes.

- getIsLoginPopup · function · L46-L53 — Detects whether the current window is an authentication popup based on URL parameters or window.opener reference.
- usePopupLogin · function · L55-L84 — Opens a popup for user login and falls back to full-page redirect if popup is blocked.
- useSettingsMessageListener · function · L86-L109 — Listens for cross-origin messages from settings domain to refresh user data or handle session expiration.
- handleMessage · function · L94-L105 — Processes incoming messages for settings updates or session termination from the API origin.
- useLoginPopupListener · function · L111-L189 — Listens for login/logout messages via BroadcastChannel to synchronize user state across tabs and reload relevant data.
- listener · function · L182-L182 — Delegates incoming broadcast messages to the cached handleMessage callback for processing.
