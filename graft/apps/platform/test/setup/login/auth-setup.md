# apps/platform/test/setup/login/auth-setup.ts · [[authentication-and-token-management]] [[test-infrastructure-and-utilities]]

Module that orchestrates authenticated test user setup by validating cached tokens or executing a browser-based login flow via an auth proxy to obtain and persist API credentials.

- hasValidTokens · function · L25-L59 — Validates whether cached authentication tokens exist and are still accepted by the API gateway.
- rejectAfter · function · L61-L63 — Creates a promise that rejects after a specified millisecond delay, used to enforce timeout deadlines.
- logBanner · function · L65-L69 — Outputs a formatted log message with visual separators for prominent status announcements.
- setupPageLogging · function · L71-L78 — Attaches Playwright browser console and error listeners to log browser-side events during authentication.
- getAuthErrorMessage · function · L80-L89 — Extracts and formats error messages from the authentication page response to provide user-friendly diagnostics.
- runLoginFlow · function · L91-L170 — Orchestrates the full interactive login sequence including proxy server setup, credential entry, token acquisition, and state cleanup.
- AuthSetupOptions · type · L172-L174 — Configuration object type that controls optional behaviors during authentication setup execution.
- runAuthSetup · function · L176-L212 — Main entry point that conditionally runs the authentication flow only if no valid cached tokens exist and credentials are configured.
