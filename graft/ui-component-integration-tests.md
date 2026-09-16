---
name: UI Component Integration Tests
slug: ui-component-integration-tests
type: system
sources:
  - path: apps/platform/test/integration/Sidebar.spec.tsx
    hash: cadcf9cac275a362c8ad4fa16c7c88d904f5676cd90b5909c78d792efaee3aec
  - path: apps/platform/test/integration/User.spec.tsx
    hash: 42675a0bdf269a52a852246815f383820163cdf8ee5be28cef88ed6b159b3ea3
sources_digest: d23d6ba94b3a1542307f9dea37409125ea742656f929d7589b056dc779fae082
links:
  - to: server-side-internationalization-i18n
    relation: depends_on
    description: Sidebar tests verify language switching via i18n module
  - to: session-expiration-handling
    relation: validates
    description: >-
      User.spec.tsx verifies expired session UI display after setLoginExpired
      dispatch
  - to: test-infrastructure-and-utilities
    relation: depends_on
    description: Uses render() and makeStore() for component and state setup
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Validates Sidebar interactions (feedback submission, language switching, sidebar visibility toggling, help hint management) and User session expiration display. Tests verify language state synchronization via i18n, localStorage persistence of hint dismissals, and Redux action dispatching for UI state changes.

## Related

- depends on [[server-side-internationalization-i18n]] — Sidebar tests verify language switching via i18n module
- validates [[session-expiration-handling]] — User.spec.tsx verifies expired session UI display after setLoginExpired dispatch
- depends on [[test-infrastructure-and-utilities]] — Uses render() and makeStore() for component and state setup

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
