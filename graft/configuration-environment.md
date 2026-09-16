---
name: Configuration & Environment
slug: configuration-environment
type: system
sources:
  - path: apps/platform/i18next.config.ts
    hash: 6428daccb7d7aeda67cad41a391545b04d93a740adc845777c96dbc1afbcda6b
  - path: apps/platform/instrument.server.mjs
    hash: 1592c4226d46a1bf9e176c853e355c36cea5e2bd5c41e69e8ca48967a3560302
  - path: apps/platform/proxy.ts
    hash: 492c6235f7cf63b68f3b5740fce9b8dd304dc7cbcdf30e5a1ee4763eae9045c8
sources_digest: 8d8308e798663d014f5293c7e663a77c70831537772245c541c7ab7f07b1f86a
links:
  - to: navigation-system
    relation: configures
    description: >-
      PLATFORM_MODE flag determines whether PlatformNav (new) or LegacyNav (old)
      renders
  - to: onboarding-system
    relation: configures
    description: IS_CHATBOT_ENABLED flag gates copilot chat availability in OnboardingModal
generator:
  version: 1
covers:
  - symbol: createAuthRequiredResponse
    kind: function
    at: 'apps/platform/proxy.ts:L12-L17'
  - symbol: isMonitoringPath
    kind: function
    at: 'apps/platform/proxy.ts:L19-L22'
  - symbol: isApiPath
    kind: function
    at: 'apps/platform/proxy.ts:L26-L28'
  - symbol: ProxyResult
    kind: type
    at: 'apps/platform/proxy.ts:L30-L33'
  - symbol: proxy
    kind: function
    at: 'apps/platform/proxy.ts:L35-L74'
---

<!-- context:generated:start -->

## Summary

Provides environment-driven settings for feature flags (PLATFORM_MODE for nav UI selection, IS_CHATBOT_ENABLED for copilot), basic auth gating (BASIC_AUTH, BASIC_AUTH_USER, BASIC_AUTH_PASS), Sentry error tracking initialization, and i18next extraction pipeline configuration.

## Related

- configures [[navigation-system]] — PLATFORM_MODE flag determines whether PlatformNav (new) or LegacyNav (old) renders
- configures [[onboarding-system]] — IS_CHATBOT_ENABLED flag gates copilot chat availability in OnboardingModal

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
