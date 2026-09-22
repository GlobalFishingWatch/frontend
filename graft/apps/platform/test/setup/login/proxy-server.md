# apps/platform/test/setup/login/proxy-server.ts · [[authentication-and-token-management]] [[test-infrastructure-and-utilities]]

Module that provides an HTTP proxy server for testing OAuth login flow with token extraction from callback.

- startAuthProxyServer · function · L9-L47 — Sets up a test proxy server that redirects to login, captures the access token from the OAuth callback, and returns the server and token promise.
