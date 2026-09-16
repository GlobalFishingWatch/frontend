# apps/platform-e2e/src/helpers/hydration.ts · [[platform-e2e-test-helpers]] [[playwright-e2e-cross-tab-communication-and-hydration-testing]]

Helper module that provides utilities to detect when React hydration is complete in end-to-end tests.

- waitForHydration · function · L11-L25 — Waits for React to hydrate the sidebar by polling for the presence of React internal fiber keys on the sidebar DOM node.
