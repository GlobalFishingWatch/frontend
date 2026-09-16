---
name: Translation & Localization
slug: translation-localization
type: concept
sources:
  - path: apps/platform/features/i18n/utils.ts
    hash: 1c65390f364bd851296342da55216dc6dd1f2e2e07c28a6262d6f24e570ff2ce
  - path: apps/platform/i18next.config.ts
    hash: 6428daccb7d7aeda67cad41a391545b04d93a740adc845777c96dbc1afbcda6b
sources_digest: be0a04fb16283091a4100bd70d002d1ed2372e664a2d3d91ea2e1121405a8418
links:
  - to: navigation-system
    relation: uses
    description: >-
      nav.config builds localized menu labels and routes via translation
      function
  - to: onboarding-system
    relation: uses
    description: Onboarding cards and copilot examples fetched via translation function
generator:
  version: 1
covers:
  - symbol: PlaceholderBySelectionParams
    kind: type
    at: 'apps/platform/features/i18n/utils.ts:L9-L13'
  - symbol: getPlaceholderBySelections
    kind: function
    at: 'apps/platform/features/i18n/utils.ts:L14-L38'
  - symbol: joinTranslatedList
    kind: function
    at: 'apps/platform/features/i18n/utils.ts:L40-L50'
---

<!-- context:generated:start -->

## Summary

i18next-based multilingual support with extraction pipeline (i18next.config.ts), type generation, and three preservation patterns for dynamic keys: subtree patterns (e.g., vessel.gearTypes.*), static programmatic keys (e.g., common.fishing), and hand-managed namespaces (layer-library, workspaces). Navigation URLs and content adapt per-language due to site structure differences.

## Related

- uses [[navigation-system]] — nav.config builds localized menu labels and routes via translation function
- uses [[onboarding-system]] — Onboarding cards and copilot examples fetched via translation function

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
