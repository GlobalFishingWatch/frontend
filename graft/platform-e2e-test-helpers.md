---
name: Platform E2E test helpers
slug: platform-e2e-test-helpers
type: system
sources:
  - path: apps/platform-e2e/src/helpers/hydration.ts
    hash: 8ae5515b000847d6435b968c92890b64d360817fe17a795e6832fd101f926382
  - path: apps/platform-e2e/src/helpers/map.ts
    hash: 183de35567e7731c0414bafed9516a5412d6945272b879e278ac936f1ec5d91d
  - path: apps/platform-e2e/src/helpers/modals.ts
    hash: 2f6ed3f8c9277296a81eff236d7286156cd0f4069ed42c13cb6fb09c2467afa7
  - path: apps/platform-e2e/src/helpers/timeouts.ts
    hash: 1d473a9748561f653e28b3aa12c74255e34f9c651caf38c7702e797180417e2e
sources_digest: ae6fe9fe5d0942205c633240dd1d8af54b98519875246afa3fbac8a2f9f3ca82
links:
  - to: platform-e2e-test-fixtures-and-page-objects
    relation: uses
    description: >-
      fixtures.ts uses disableWelcomePopups; LoginPage uses waitForHydration and
      disableWelcomePopups
generator:
  version: 1
covers:
  - symbol: waitForHydration
    kind: function
    at: 'apps/platform-e2e/src/helpers/hydration.ts:L11-L25'
  - symbol: clickMapUntilVisible
    kind: function
    at: 'apps/platform-e2e/src/helpers/map.ts:L10-L20'
  - symbol: disableWelcomePopups
    kind: function
    at: 'apps/platform-e2e/src/helpers/modals.ts:L3-L23'
---

<!-- context:generated:start -->

## Summary

Utility functions supporting E2E test scenarios across map interaction, modal suppression, and async detection. waitForHydration polls for React fiber metadata keys to detect client-side hydration completion—critical for cross-tab BroadcastChannel tests where messages aren't buffered and must arrive after listener registration during hydration. disableWelcomePopups injects localStorage-based flags suppressing first-visit UI (OnboardingPanelDismissed, VesselProfilePopup, DeepSeaMiningPopup, HighlightPopup, i18nextLng, 10+ hint flags). clickMapUntilVisible retries map clicks using expect().toPass() until expected UI becomes visible, mitigating flaky layer-loading timing. TIMEOUTS constants (SHORT 5s, MEDIUM 15s, LONG 30s, TEST 180s) centralize timeout configuration.

## Related

- uses [[platform-e2e-test-fixtures-and-page-objects]] — fixtures.ts uses disableWelcomePopups; LoginPage uses waitForHydration and disableWelcomePopups

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
