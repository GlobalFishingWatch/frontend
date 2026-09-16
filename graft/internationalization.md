---
name: Internationalization
slug: internationalization
type: system
sources:
  - path: apps/platform/features/i18n/i18n-state.utils.ts
    hash: d7f05be1bb1b6ed00118758fe5c4d86e1db67a2d2990e39de9e0be9a0b53bb06
  - path: apps/platform/features/i18n/i18n.config.ts
    hash: de35cc7f820ebf851a06d5206a39ed6cc3f2b37abe4802b86e9bfc69550b75c9
  - path: apps/platform/features/i18n/i18n.dehydrated-state.ts
    hash: 906c47eac274fe0f796525bca7ead2dab71714ed9090efb1ca19bcd86812d158
  - path: apps/platform/features/i18n/i18n.hooks.ts
    hash: d5f0cc0571c94c3a6f01e6d15005e77ebb48f519e6037461dfd176c8480042df
  - path: apps/platform/features/i18n/i18n.server.ts
    hash: 3ab0aef73f406814119283013c6814105b2c069328e45af1fec3cf23d479df6a
  - path: apps/platform/features/i18n/i18n.ts
    hash: 0d01cf607f76b312c651e50d2c9b74b3d4f23a11c1a1ae6a068e328fbb01ea5b
  - path: apps/platform/features/i18n/i18nDate.tsx
    hash: 34eb343da82e8376fd256ed249f67477cb3b66ed78335cc298942df47415854a
  - path: apps/platform/features/i18n/i18nDate.utils.ts
    hash: a58497a48431490d810ea79b027adf3db1dde3e77a29486ccacd0f069004edfa
  - path: apps/platform/features/i18n/i18next.d.ts
    hash: 1d32c68d5da3707ec59e9a77a3aed256092a400bd68ea03655228ce4aaf4c674
  - path: apps/platform/features/i18n/i18nFlag.tsx
    hash: 06b76b5a185d784139bdbaea10f720539b625ec373701a612e402ed7710fe062
  - path: apps/platform/features/i18n/i18nNumber.tsx
    hash: 74cdc51abb4beb929bc9a7d837dabb780336bd3b9c27e74f4dcd9abe733d6481
  - path: apps/platform/features/i18n/i18nNumber.utils.ts
    hash: 94f34b7e3bd1f7dceb9c55cc2ab87db44c1c15302348241c2afb752bacedac31
  - path: apps/platform/features/i18n/I18nSSRProvider.tsx
    hash: e4669195ff5b42069e2ac8c71c893aa79cf49118ecfaf330ca572e0aa1e926bd
  - path: apps/platform/features/i18n/language.hooks.ts
    hash: ad6aadd66463eb04597146c5dab11902fccd6207fdd4860d65c380de2c814fa3
  - path: apps/platform/features/i18n/LanguageToggle.tsx
    hash: 4e280ca6b5e6ac5d9682a31364650eb807fecc01270ff76b65267a82bba254da
  - path: apps/platform/features/i18n/request-i18n.server.ts
    hash: 2fd888b08d732656dacd764c2d79664a90a09b1086dec7a5719ce1d7ca87340d
  - path: apps/platform/features/i18n/utils.datasets.ts
    hash: df183585da21aac05212218324e7b0cda787fa2abd792d604e0cbf511de9a4a3
sources_digest: 8ed4123a947f7bb77a3cf42b3fd4f3bbdc229ccdf2b577489335fb9d6d500421
links:
  - to: redux-state-management
    relation: uses
    description: >-
      Persists user language preference via setUserLanguage action in
      user.slice; checks selectHasEditTranslationsPermissions for Crowdin access
  - to: router
    relation: uses
    description: >-
      Invalidates help hub routes on language change via TanStack Router to
      refetch localized help content
generator:
  version: 1
covers:
  - symbol: createI18nFromState
    kind: function
    at: 'apps/platform/features/i18n/I18nSSRProvider.tsx:L10-L26'
  - symbol: I18nSSRProvider
    kind: function
    at: 'apps/platform/features/i18n/I18nSSRProvider.tsx:L28-L38'
  - symbol: CrowdinScripts
    kind: function
    at: 'apps/platform/features/i18n/LanguageToggle.tsx:L13-L30'
  - symbol: LanguageToggleProps
    kind: type
    at: 'apps/platform/features/i18n/LanguageToggle.tsx:L32-L35'
  - symbol: LanguageToggle
    kind: function
    at: 'apps/platform/features/i18n/LanguageToggle.tsx:L37-L74'
  - symbol: I18nResourceValue
    kind: type
    at: 'apps/platform/features/i18n/i18n-state.utils.ts:L5-L5'
  - symbol: I18nServerState
    kind: type
    at: 'apps/platform/features/i18n/i18n-state.utils.ts:L7-L10'
  - symbol: isValidI18nServerState
    kind: function
    at: 'apps/platform/features/i18n/i18n-state.utils.ts:L12-L27'
  - symbol: serializeI18nState
    kind: function
    at: 'apps/platform/features/i18n/i18n-state.utils.ts:L29-L40'
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
  - symbol: DehydratedRouterData
    kind: type
    at: 'apps/platform/features/i18n/i18n.dehydrated-state.ts:L4-L4'
  - symbol: TanStackBootstrapWindow
    kind: type
    at: 'apps/platform/features/i18n/i18n.dehydrated-state.ts:L6-L9'
  - symbol: getDehydratedRootI18nState
    kind: function
    at: 'apps/platform/features/i18n/i18n.dehydrated-state.ts:L11-L18'
  - symbol: useUserLanguageUpdate
    kind: function
    at: 'apps/platform/features/i18n/i18n.hooks.ts:L9-L30'
  - symbol: onLanguageChanged
    kind: function
    at: 'apps/platform/features/i18n/i18n.hooks.ts:L18-L23'
  - symbol: detectLanguageFromRequest
    kind: function
    at: 'apps/platform/features/i18n/i18n.server.ts:L29-L38'
  - symbol: getLanguageResources
    kind: function
    at: 'apps/platform/features/i18n/i18n.server.ts:L45-L65'
  - symbol: PackageNsCacheEntry
    kind: type
    at: 'apps/platform/features/i18n/i18n.server.ts:L77-L77'
  - symbol: fetchServerPackageNamespace
    kind: function
    at: 'apps/platform/features/i18n/i18n.server.ts:L80-L104'
  - symbol: loadServerPackageNamespaces
    kind: function
    at: 'apps/platform/features/i18n/i18n.server.ts:L111-L124'
  - symbol: invalidateServerPackageNamespaceCache
    kind: function
    at: 'apps/platform/features/i18n/i18n.server.ts:L131-L146'
  - symbol: createI18nForLanguage
    kind: function
    at: 'apps/platform/features/i18n/i18n.server.ts:L148-L170'
  - symbol: createRequestI18n
    kind: function
    at: 'apps/platform/features/i18n/i18n.server.ts:L172-L174'
  - symbol: __setServerI18nAccessor
    kind: function
    at: 'apps/platform/features/i18n/i18n.ts:L73-L75'
  - symbol: getActiveI18n
    kind: function
    at: 'apps/platform/features/i18n/i18n.ts:L77-L79'
  - symbol: getActiveI18nState
    kind: function
    at: 'apps/platform/features/i18n/i18n.ts:L81-L93'
  - symbol: getActiveI18nLanguage
    kind: function
    at: 'apps/platform/features/i18n/i18n.ts:L95-L98'
  - symbol: get
    kind: method
    at: 'apps/platform/features/i18n/i18n.ts:L108-L112'
  - symbol: Dates
    kind: type
    at: 'apps/platform/features/i18n/i18nDate.tsx:L7-L11'
  - symbol: I18nDate
    kind: function
    at: 'apps/platform/features/i18n/i18nDate.tsx:L13-L16'
  - symbol: formatI18DateParams
    kind: type
    at: 'apps/platform/features/i18n/i18nDate.utils.ts:L12-L16'
  - symbol: formatI18nDate
    kind: function
    at: 'apps/platform/features/i18n/i18nDate.utils.ts:L20-L36'
  - symbol: useI18nDate
    kind: function
    at: 'apps/platform/features/i18n/i18nDate.utils.ts:L38-L45'
  - symbol: useI18nFlag
    kind: function
    at: 'apps/platform/features/i18n/i18nFlag.tsx:L6-L9'
  - symbol: I18nFlag
    kind: function
    at: 'apps/platform/features/i18n/i18nFlag.tsx:L11-L14'
  - symbol: I18Number
    kind: type
    at: 'apps/platform/features/i18n/i18nNumber.tsx:L5-L5'
  - symbol: I18nNumber
    kind: function
    at: 'apps/platform/features/i18n/i18nNumber.tsx:L7-L10'
  - symbol: I18Number
    kind: type
    at: 'apps/platform/features/i18n/i18nNumber.utils.ts:L7-L7'
  - symbol: I18NumberOptions
    kind: type
    at: 'apps/platform/features/i18n/i18nNumber.utils.ts:L8-L15'
  - symbol: formatI18nNumber
    kind: function
    at: 'apps/platform/features/i18n/i18nNumber.utils.ts:L17-L32'
  - symbol: useI18nNumber
    kind: function
    at: 'apps/platform/features/i18n/i18nNumber.utils.ts:L34-L37'
  - symbol: LibraryResources
    kind: type
    at: 'apps/platform/features/i18n/i18next.d.ts:L8-L11'
  - symbol: Resources
    kind: type
    at: 'apps/platform/features/i18n/i18next.d.ts:L13-L13'
  - symbol: CustomTypeOptions
    kind: interface
    at: 'apps/platform/features/i18n/i18next.d.ts:L16-L23'
  - symbol: LanguageOption
    kind: type
    at: 'apps/platform/features/i18n/language.hooks.ts:L24-L28'
  - symbol: useLanguageOptions
    kind: function
    at: 'apps/platform/features/i18n/language.hooks.ts:L31-L91'
  - symbol: I18nInstance
    kind: type
    at: 'apps/platform/features/i18n/request-i18n.server.ts:L13-L13'
  - symbol: getFallbackInstance
    kind: function
    at: 'apps/platform/features/i18n/request-i18n.server.ts:L22-L27'
  - symbol: runRequestWithI18n
    kind: function
    at: 'apps/platform/features/i18n/request-i18n.server.ts:L29-L34'
  - symbol: getRequestI18n
    kind: function
    at: 'apps/platform/features/i18n/request-i18n.server.ts:L36-L38'
  - symbol: getDatasetSourceTranslated
    kind: function
    at: 'apps/platform/features/i18n/utils.datasets.ts:L7-L26'
---

<!-- context:generated:start -->

## Summary

Multi-layer i18n system supporting client and server-side rendering with automatic language detection, lazy-loading translations from disk and CDN, and persistent user language preferences in Redux. Handles Crowdin in-context translation for developers, type-safe translation keys, and locale-aware date/number formatting.

## Related

- uses [[redux-state-management]] — Persists user language preference via setUserLanguage action in user.slice; checks selectHasEditTranslationsPermissions for Crowdin access
- uses [[router]] — Invalidates help hub routes on language change via TanStack Router to refetch localized help content

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
