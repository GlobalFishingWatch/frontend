# apps/platform/test/utils/network/gfw-api-test.ts · [[api-request-test-utilities]]

Test utilities for mocking and asserting on GFW API fetch requests in browser tests.

- GFWFetchSpy · type · L8-L8 — Type alias for a Vitest mock instance of the GFWAPI fetch method.
- GFWAPITestUtils · class · L15-L41 — Test utility class that provides helpers for waiting on and asserting GFW API requests.
- constructor · method · L18-L20 — Initializes the test utility by creating a spy on the GFWAPI fetch method.
- waitForRequest · method · L22-L40 — Waits for a matching API request to be received, filtering by URL substring and enforcing a timeout.
