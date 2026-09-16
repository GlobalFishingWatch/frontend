---
name: i18n System
slug: i18n-system
type: system
sources:
  - path: apps/platform/utils/shared.ts
    hash: 8e5074e8b33fcd7c1853ee79c18d0ef76b9dc1f0028c973400ace6c9d0a7070f
  - path: apps/port-labeler/src/features/i18n/i18n.ts
    hash: 154550575fc136e55e021eeec440f54dd37c5841994c8073802b18218b4f8740
  - path: apps/port-labeler/src/features/i18n/i18nDate.tsx
    hash: 3646d954bf5735889d022d62adeb7b13b94cc1a96d539e46a71972c8b0282bc4
  - path: apps/port-labeler/src/features/i18n/i18nDate.utils.ts
    hash: 854cf5ab7e7aad63bd1b790a36ccccd87b092ed2aee6decdf85104fb2354b83d
  - path: apps/port-labeler/src/features/i18n/i18nFlag.tsx
    hash: 155c6e62db469ef0dae730cea9bc3807cd196d4a85b9420866d9091bf749cc4f
  - path: apps/port-labeler/src/features/i18n/i18nFlag.utils.ts
    hash: c72a6729040224846ac887567087528fa22bbf8ef2a32b9a18cd4e8d678d2656
  - path: apps/port-labeler/src/features/i18n/i18nNumber.tsx
    hash: 75d34f33e3916e7036b8757c2becfe61edbfc887fe1365a5ead3d9366a386504
  - path: apps/port-labeler/src/features/i18n/i18nNumber.utils.ts
    hash: 7d842d3c05d0e91233172285bb57c2587cd385b8c47f00536b43289a6a677fa4
  - path: apps/port-labeler/src/features/i18n/LanguageToggle.tsx
    hash: 99b63020a7af2e8703dec11677ba15a38050fe0cb929c42cbc289d4df1f1ca31
  - path: apps/port-labeler/src/features/i18n/react-i18next.d.ts
    hash: a014f7c5acebd4d2d1d7f422de9bf8ccf8abb9e95d667716d7837eaf31457db0
  - path: apps/port-labeler/src/features/i18n/utils.ts
    hash: 4fcf60e08de21ca5362c742f2014ea6e4a461abb9305948bc80409ba07d06308
sources_digest: dc113a510701c0b46a4cfcfb421467e188044049e777315782db084a16383134
links:
  - to: i18n-type-definitions
    relation: implements
    description: >-
      react-i18next.d.ts declares the namespace and resource structure required
      by i18n setup
generator:
  version: 1
covers:
  - symbol: capitalize
    kind: function
    at: 'apps/platform/utils/shared.ts:L5-L8'
  - symbol: toFixed
    kind: function
    at: 'apps/platform/utils/shared.ts:L10-L16'
  - symbol: Field
    kind: type
    at: 'apps/platform/utils/shared.ts:L18-L18'
  - symbol: sortStrings
    kind: function
    at: 'apps/platform/utils/shared.ts:L20-L20'
  - symbol: sortFields
    kind: function
    at: 'apps/platform/utils/shared.ts:L22-L38'
  - symbol: listAsSentence
    kind: function
    at: 'apps/platform/utils/shared.ts:L40-L45'
  - symbol: LanguageToggleProps
    kind: type
    at: 'apps/port-labeler/src/features/i18n/LanguageToggle.tsx:L11-L14'
  - symbol: LanguageToggle
    kind: function
    at: 'apps/port-labeler/src/features/i18n/LanguageToggle.tsx:L16-L45'
  - symbol: toggleLanguage
    kind: function
    at: 'apps/port-labeler/src/features/i18n/LanguageToggle.tsx:L21-L23'
  - symbol: Dates
    kind: type
    at: 'apps/port-labeler/src/features/i18n/i18nDate.tsx:L7-L10'
  - symbol: I18nDate
    kind: function
    at: 'apps/port-labeler/src/features/i18n/i18nDate.tsx:L12-L15'
  - symbol: formatI18DateParams
    kind: type
    at: 'apps/port-labeler/src/features/i18n/i18nDate.utils.ts:L10-L10'
  - symbol: formatI18nDate
    kind: function
    at: 'apps/port-labeler/src/features/i18n/i18nDate.utils.ts:L12-L20'
  - symbol: useI18nDate
    kind: function
    at: 'apps/port-labeler/src/features/i18n/i18nDate.utils.ts:L22-L25'
  - symbol: I18nFlag
    kind: function
    at: 'apps/port-labeler/src/features/i18n/i18nFlag.tsx:L5-L8'
  - symbol: useI18nFlag
    kind: function
    at: 'apps/port-labeler/src/features/i18n/i18nFlag.utils.ts:L3-L6'
  - symbol: I18nNumber
    kind: function
    at: 'apps/port-labeler/src/features/i18n/i18nNumber.tsx:L6-L9'
  - symbol: I18Number
    kind: type
    at: 'apps/port-labeler/src/features/i18n/i18nNumber.utils.ts:L7-L7'
  - symbol: I18NumberOptions
    kind: type
    at: 'apps/port-labeler/src/features/i18n/i18nNumber.utils.ts:L8-L15'
  - symbol: formatI18nNumber
    kind: function
    at: 'apps/port-labeler/src/features/i18n/i18nNumber.utils.ts:L17-L32'
  - symbol: useI18nNumber
    kind: function
    at: 'apps/port-labeler/src/features/i18n/i18nNumber.utils.ts:L34-L37'
  - symbol: Resources
    kind: interface
    at: 'apps/port-labeler/src/features/i18n/react-i18next.d.ts:L11-L16'
  - symbol: joinTranslatedList
    kind: function
    at: 'apps/port-labeler/src/features/i18n/utils.ts:L3-L7'
---

<!-- context:generated:start -->

## Summary

Centralized internationalization infrastructure providing translation function (t), locale detection, HTTP-based translation loading via CDN/backend, and React integration through i18next and react-i18next. Supports namespace-based organization (domain-specific vs app-specific) and automatic HTML lang attribute updates.

## Related

- implements [[i18n-type-definitions]] — react-i18next.d.ts declares the namespace and resource structure required by i18n setup

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
