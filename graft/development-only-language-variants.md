---
name: Development-only Language Variants
slug: development-only-language-variants
type: concept
sources:
  - path: apps/platform/features/i18n/i18n.config.ts
    hash: de35cc7f820ebf851a06d5206a39ed6cc3f2b37abe4802b86e9bfc69550b75c9
  - path: apps/platform/features/i18n/language.hooks.ts
    hash: ad6aadd66463eb04597146c5dab11902fccd6207fdd4860d65c380de2c814fa3
  - path: apps/platform/features/i18n/LanguageToggle.tsx
    hash: 4e280ca6b5e6ac5d9682a31364650eb807fecc01270ff76b65267a82bba254da
sources_digest: cc0ee14d9174da7b57551492d35b6d9fcedcb25eb6f64f4d6dc9c11180a2db85
links:
  - to: internationalization
    relation: part_of
    description: >-
      Controls visibility of development language options and Crowdin JIPT
      script injection for in-context translation workflows
generator:
  version: 1
covers:
  - symbol: CrowdinScripts
    kind: function
    at: 'apps/platform/features/i18n/LanguageToggle.tsx:L13-L30'
  - symbol: LanguageToggleProps
    kind: type
    at: 'apps/platform/features/i18n/LanguageToggle.tsx:L32-L35'
  - symbol: LanguageToggle
    kind: function
    at: 'apps/platform/features/i18n/LanguageToggle.tsx:L37-L74'
  - symbol: i18nSupportedLocale
    kind: type
    at: 'apps/platform/features/i18n/i18n.config.ts:L27-L28'
  - symbol: getPackageNamespaceUrl
    kind: function
    at: 'apps/platform/features/i18n/i18n.config.ts:L44-L46'
  - symbol: parseSupportedLanguage
    kind: function
    at: 'apps/platform/features/i18n/i18n.config.ts:L48-L70'
  - symbol: normalizeI18nLanguage
    kind: function
    at: 'apps/platform/features/i18n/i18n.config.ts:L72-L74'
  - symbol: resolveLanguageFromSources
    kind: function
    at: 'apps/platform/features/i18n/i18n.config.ts:L79-L100'
  - symbol: toContentLocale
    kind: function
    at: 'apps/platform/features/i18n/i18n.config.ts:L116-L122'
  - symbol: toDocumentLang
    kind: function
    at: 'apps/platform/features/i18n/i18n.config.ts:L124-L126'
  - symbol: LanguageOption
    kind: type
    at: 'apps/platform/features/i18n/language.hooks.ts:L24-L28'
  - symbol: useLanguageOptions
    kind: function
    at: 'apps/platform/features/i18n/language.hooks.ts:L31-L91'
---

<!-- context:generated:start -->

## Summary

Feature gating pattern that conditionally includes Crowdin staging language codes (source, val) and Crowdin in-context translation mode only when IS_DEVELOPMENT_ENV is true and tests are not running, maintaining type safety while enabling translator workflows without cluttering production UI.

## Related

- part of [[internationalization]] — Controls visibility of development language options and Crowdin JIPT script injection for in-context translation workflows

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
