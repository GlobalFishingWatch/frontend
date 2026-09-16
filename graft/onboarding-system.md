---
name: Onboarding System
slug: onboarding-system
type: system
sources:
  - path: apps/platform/features/onboarding/onboarding.auto-open.hooks.ts
    hash: 3d57ac7e599669e07c91ee75be63f931dcc6af33a2cf6de1f5b5de2c3d52f80a
  - path: apps/platform/features/onboarding/onboarding.config.ts
    hash: 5e7928b61334f15923848de264ae529342d16173ff327b22b883c6f6eaf84761
  - path: apps/platform/features/onboarding/onboarding.hooks.ts
    hash: 6eb2fd98738e5970161215a9e39a8fe04ced6e02fd60a2037595ef0a0a8a2688
  - path: apps/platform/features/onboarding/OnboardingModal.tsx
    hash: ec40d49ac03bd3413e5835d4033965657ce23653ed03951e09929b46fbf32bfd
sources_digest: d8c5dc7ef64e8993d43c0946a7c9b9bf87fdc161127ec36cd0be1abdf11e3ff8
links:
  - to: analytics-tracking
    relation: uses
    description: >-
      Tracks onboarding engagement, card clicks, and copilot prompt usage via
      trackEvent
  - to: help-system-integration
    relation: uses
    description: >-
      Card actions open help documentation via useSidePanel; copilot prompts
      feed into chat side panel
  - to: modal-system
    relation: part_of
    description: >-
      OnboardingModal is lazily loaded and conditionally rendered by the Modal
      System
  - to: translation-localization
    relation: uses
    description: Fetches localized card content and copilot examples via react-i18next
generator:
  version: 1
covers:
  - symbol: getTutorialsLink
    kind: function
    at: 'apps/platform/features/onboarding/OnboardingModal.tsx:L33-L37'
  - symbol: getFAQsLink
    kind: function
    at: 'apps/platform/features/onboarding/OnboardingModal.tsx:L39-L43'
  - symbol: OnboardingModal
    kind: function
    at: 'apps/platform/features/onboarding/OnboardingModal.tsx:L45-L196'
  - symbol: close
    kind: function
    at: 'apps/platform/features/onboarding/OnboardingModal.tsx:L58-L58'
  - symbol: useOnboardingDismissed
    kind: function
    at: 'apps/platform/features/onboarding/onboarding.auto-open.hooks.ts:L23-L25'
  - symbol: useOnboardingAutoOpen
    kind: function
    at: 'apps/platform/features/onboarding/onboarding.auto-open.hooks.ts:L27-L67'
  - symbol: TFunc
    kind: type
    at: 'apps/platform/features/onboarding/onboarding.config.ts:L5-L5'
  - symbol: OnboardingCardId
    kind: type
    at: 'apps/platform/features/onboarding/onboarding.config.ts:L7-L7'
  - symbol: OnboardingCard
    kind: type
    at: 'apps/platform/features/onboarding/onboarding.config.ts:L9-L14'
  - symbol: getCopilotExamples
    kind: function
    at: 'apps/platform/features/onboarding/onboarding.config.ts:L17-L30'
  - symbol: getOnboardingCards
    kind: function
    at: 'apps/platform/features/onboarding/onboarding.config.ts:L32-L53'
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
---

<!-- context:generated:start -->

## Summary

Orchestrates the welcome modal experience for new users, including animated tutorial cards, AI copilot integration, and typewriter placeholder animations. Auto-opens on first workspace visit (unless dismissed or in read-only mode), with lazy-loaded hooks to avoid bloating the always-rendered Modals component.

## Related

- uses [[analytics-tracking]] — Tracks onboarding engagement, card clicks, and copilot prompt usage via trackEvent
- uses [[help-system-integration]] — Card actions open help documentation via useSidePanel; copilot prompts feed into chat side panel
- part of [[modal-system]] — OnboardingModal is lazily loaded and conditionally rendered by the Modal System
- uses [[translation-localization]] — Fetches localized card content and copilot examples via react-i18next

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
