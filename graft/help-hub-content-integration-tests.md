---
name: Help Hub Content Integration Tests
slug: help-hub-content-integration-tests
type: system
sources:
  - path: apps/platform/test/integration/HelpHub.spec.tsx
    hash: c00082a64b3dd71ade6d76191d38c7533264b4fc41282f3d19a9987f71158968
sources_digest: 96ce43e01ad4316096075ab001e1ee589a57d45650d70935ed1c318359c96d56
links:
  - to: test-infrastructure-and-utilities
    relation: depends_on
    description: >-
      Uses render(), makeStore(), and CMS loader mocks; depends on help-hub.ts
      fixtures
generator:
  version: 1
covers:
  - symbol: renderLandingPage
    kind: function
    at: 'apps/platform/test/integration/HelpHub.spec.tsx:L45-L50'
  - symbol: renderSectionPage
    kind: function
    at: 'apps/platform/test/integration/HelpHub.spec.tsx:L52-L57'
  - symbol: waitForLandingSection
    kind: function
    at: 'apps/platform/test/integration/HelpHub.spec.tsx:L60-L63'
  - symbol: pending
    kind: function
    at: 'apps/platform/test/integration/HelpHub.spec.tsx:L222-L222'
---

<!-- context:generated:start -->

## Summary

Validates Strapi CMS-backed Help Hub content display, section navigation, search filtering with highlighted results, image modal expansion, and graceful error handling. Uses hoisted loader mocks to swap fixture responses while preserving RTK Query lifecycle for realistic loading state testing.

## Related

- depends on [[test-infrastructure-and-utilities]] — Uses render(), makeStore(), and CMS loader mocks; depends on help-hub.ts fixtures

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
