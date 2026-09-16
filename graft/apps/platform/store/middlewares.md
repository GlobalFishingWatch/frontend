# apps/platform/store/middlewares.ts · [[redux-store-configuration]] [[session-expiration-handling]]

Middleware module that handles Redux action interception and user session expiration on refresh token failures.

- logoutUserMiddleware · function · L11-L37 — Redux middleware that detects refresh token failures and dispatches a login expiration action for non-guest users.
