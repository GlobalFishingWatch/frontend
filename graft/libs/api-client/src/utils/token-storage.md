# libs/api-client/src/utils/token-storage.ts · [[api-client-browser-utilities]] [[isomorphic-code-patterns-for-ssr]]

Module providing factory functions to create token storage implementations backed by localStorage or document cookies.

- TokenStorage · interface · L4-L7 — Interface defining the contract for get and set operations on token storage.
- createLocalStorageTokenStorage · function · L9-L18 — Factory function that creates a TokenStorage implementation using browser localStorage with automatic cleanup when value is cleared.
- createCookieTokenStorage · function · L20-L30 — Factory function that creates a TokenStorage implementation using document cookies with server-side rendering safety checks.
