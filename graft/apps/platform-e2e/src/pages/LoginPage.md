# apps/platform-e2e/src/pages/LoginPage.ts · [[authentication-state-machine-and-permission-gating]] [[platform-e2e-test-fixtures-and-page-objects]] [[playwright-e2e-cross-tab-communication-and-hydration-testing]]

E2E test page object that encapsulates login, logout, session management, and user state verification interactions for the platform application.

- requireEnv · function · L14-L20 — Retrieves and validates required environment variables, throwing an error if missing.
- LoginPage · class · L22-L225 — Page object for the login flow and authentication state management in end-to-end tests.
- constructor · method · L34-L42 — Initializes the LoginPage with Playwright page/context and caches UI element locators.
- openLoginPopup · method · L44-L55 — Opens the authentication popup by clicking the guest login icon and waits for navigation to the auth URL.
- login · method · L57-L66 — Performs a successful login flow via popup by entering credentials and waiting for closure and user visibility.
- loginWithPopupsBlocked · method · L68-L85 — Logs in via inline authentication flow when popup windows are blocked by the browser.
- loginExpectingFailure · method · L88-L98 — Attempts login with invalid credentials and verifies the popup remains open on the auth page.
- cancelLogin · method · L101-L104 — Opens a login popup and closes it without submitting credentials.
- newTab · method · L106-L112 — Creates a new browser tab with a fresh LoginPage instance for multi-tab test scenarios.
- openUserPanel · method · L114-L117 — Navigates to the user panel by clicking the user link and waiting for the user URL.
- logout · method · L119-L126 — Clicks the logout button and waits for the logout session request to complete.
- openSettingsPopup · method · L128-L134 — Opens the settings popup and waits for navigation to the auth settings URL.
- getSettingsUrl · method · L136-L141 — Retrieves the settings URL from the opened settings popup before closing it.
- emitGatewaySessionEnded · method · L143-L151 — Triggers a gateway session ended event by calling notifyOpener within the settings popup.
- expectSettingsRequiresLogin · method · L153-L159 — Verifies that accessing settings without a gateway session redirects to the login form.
- reload · method · L161-L163 — Reloads the current page.
- close · method · L165-L167 — Closes the page.
- clearUserToken · method · L169-L171 — Clears the user authentication token cookie from the browser context.
- clearRefreshToken · method · L173-L175 — Clears the user refresh token cookie from the browser context.
- clearCookies · method · L177-L179 — Clears all cookies from the browser context.
- getCookie · method · L181-L184 — Retrieves a cookie value by name from the browser context.
- expectLoggedIn · method · L186-L188 — Asserts that the user link is visible, indicating an authenticated session.
- expectUserVisible · method · L190-L193 — Asserts that the logged-in user's name and email are visible on the page.
- expectGuest · method · L195-L197 — Asserts that the guest login icon is visible, indicating no authenticated session.
- expectAppReady · method · L199-L201 — Asserts that the application container is visible, indicating the app has loaded.
- expectUserTokenCleared · method · L203-L205 — Asserts that the user token cookie has been cleared.
- expectUserTokenPresent · method · L206-L208 — Asserts that the user token cookie is present.
- expectRefreshTokenPresent · method · L210-L212 — Asserts that the refresh token cookie is present.
- expectRefreshTokenCleared · method · L214-L216 — Asserts that the refresh token cookie has been cleared.
- expectGatewaySessionPresent · method · L218-L220 — Polls and asserts that the gateway session cookie is present.
- expectGatewaySessionCleared · method · L222-L224 — Polls and asserts that the gateway session cookie has been cleared.
