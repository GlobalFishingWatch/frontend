---
name: Help System Integration
slug: help-system-integration
type: concept
sources:
  - path: apps/platform/features/nav/HelpHub.tsx
    hash: eaaf8702185c55681d00df7e8c4e548772333ecf640f5b1c3a83fa229c2d2221
  - path: apps/platform/features/onboarding/onboarding.hooks.ts
    hash: 6eb2fd98738e5970161215a9e39a8fe04ced6e02fd60a2037595ef0a0a8a2688
  - path: apps/platform/hooks/ocean-areas.ts
    hash: c333b49e1a407378d4cb92dca5dfd8b676bef9c1885f5230bc0619f02a7ad05b
sources_digest: 8e780158852851e5ad7de691a775c1e99d9084fc8f9d1fcf9e2ecc1b96cc6762
links:
  - to: navigation-system
    relation: part_of
    description: >-
      HelpHub is a navigation sub-component integrated into PlatformNav and
      LegacyNav
  - to: onboarding-system
    relation: part_of
    description: Onboarding card actions open guide documentation via useSidePanel
generator:
  version: 1
covers:
  - symbol: HelpHub
    kind: function
    at: 'apps/platform/features/nav/HelpHub.tsx:L21-L154'
  - symbol: onHelpClick
    kind: function
    at: 'apps/platform/features/nav/HelpHub.tsx:L33-L40'
  - symbol: getFAQsLink
    kind: function
    at: 'apps/platform/features/nav/HelpHub.tsx:L42-L45'
  - symbol: getVideoTutorialsLink
    kind: function
    at: 'apps/platform/features/nav/HelpHub.tsx:L47-L50'
  - symbol: redirectEvent
    kind: function
    at: 'apps/platform/features/nav/HelpHub.tsx:L52-L58'
  - symbol: getGuideTarget
    kind: function
    at: 'apps/platform/features/onboarding/onboarding.hooks.ts:L26-L29'
  - symbol: useOnboardingCardActions
    kind: function
    at: 'apps/platform/features/onboarding/onboarding.hooks.ts:L35-L98'
  - symbol: useOnboardingCopilotPrompt
    kind: function
    at: 'apps/platform/features/onboarding/onboarding.hooks.ts:L104-L125'
  - symbol: pickNext
    kind: function
    at: 'apps/platform/features/onboarding/onboarding.hooks.ts:L133-L136'
  - symbol: prefersReducedMotion
    kind: function
    at: 'apps/platform/features/onboarding/onboarding.hooks.ts:L138-L143'
  - symbol: useTypewriterPlaceholder
    kind: function
    at: 'apps/platform/features/onboarding/onboarding.hooks.ts:L150-L184'
  - symbol: tick
    kind: function
    at: 'apps/platform/features/onboarding/onboarding.hooks.ts:L161-L176'
  - symbol: SearchOceanAreasParams
    kind: type
    at: 'apps/platform/hooks/ocean-areas.ts:L8-L12'
  - symbol: GetOceanAreaNameParams
    kind: type
    at: 'apps/platform/hooks/ocean-areas.ts:L14-L18'
  - symbol: searchOceanAreasFn
    kind: function
    at: 'apps/platform/hooks/ocean-areas.ts:L22-L44'
  - symbol: getOceanAreaNameFn
    kind: function
    at: 'apps/platform/hooks/ocean-areas.ts:L46-L68'
  - symbol: useOceanAreas
    kind: function
    at: 'apps/platform/hooks/ocean-areas.ts:L70-L104'
---

<!-- context:generated:start -->

## Summary

Cohesive pattern for presenting contextual help: HelpHub in navigation opens help menus and tracks hint progress, OnboardingModal cards link to guide sections, and useSidePanel integrates with help section navigation to populate documentation side panels. Hints can be globally reset to redisplay dismissed tutorials.

## Related

- part of [[navigation-system]] — HelpHub is a navigation sub-component integrated into PlatformNav and LegacyNav
- part of [[onboarding-system]] — Onboarding card actions open guide documentation via useSidePanel

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
