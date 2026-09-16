# apps/platform/test/setup/vitest.setup-global.ts · [[test-infrastructure-and-utilities]]

Vitest global setup module that initializes authentication validation before running test suites.

- globalSetup · function · L7-L12 — Validates authentication setup once per test run and prevents duplicate auth log resets.
