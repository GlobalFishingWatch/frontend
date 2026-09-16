# apps/platform/test/integration/HelpHub.spec.tsx · [[help-hub-content-integration-tests]]

Integration test suite for the Help Hub feature, covering landing page navigation, section rendering, table of contents interaction, search functionality, image expansion, loading/error states, and API resilience.

- renderLandingPage · function · L45-L50 — Helper function that creates a store and renders the Help Hub landing page for test scenarios.
- renderSectionPage · function · L52-L57 — Helper function that creates a store and renders a Help Hub section page with optional navigation parameters for test scenarios.
- waitForLandingSection · function · L60-L63 — Helper function that polls for a landing section heading to become defined before returning its page element locator.
- pending · function · L222-L222 — Stub function that returns a never-settling promise to hold CMS queries in pending state for testing loading UI.
