---
name: Navigation System
slug: navigation-system
type: system
sources:
  - path: apps/platform/features/nav/HelpHub.tsx
    hash: eaaf8702185c55681d00df7e8c4e548772333ecf640f5b1c3a83fa229c2d2221
  - path: apps/platform/features/nav/LegacyNav.tsx
    hash: 929c918a430b79e8bb2938078f0c62bcec61250ea2921996c467b554e1cf2471
  - path: apps/platform/features/nav/nav.actions.ts
    hash: 956dd886fbe016581a50f3ece5cef358303fc0d29ec8b7d4d11ee2d3b8a94cdb
  - path: apps/platform/features/nav/nav.config.ts
    hash: 8943d678eb57b571d4e5c1c10a6097cf77bdd5c9e1bc288bedbac9669d8fad4e
  - path: apps/platform/features/nav/nav.hooks.ts
    hash: 0a8ab7b144796e374e1ecc575c140b47b6509d0792df7ba1e1caad964e040770
  - path: apps/platform/features/nav/nav.links.ts
    hash: 94432f3181d1a007f39f283fbd1b3dab74c4459eb21ed9679e8207896d831128
  - path: apps/platform/features/nav/PlatformNav.tsx
    hash: 39e7e552d4738dba74aa8e02c2ba3753054bdfb92aa155063e71e806ff2a78bf
  - path: apps/platform/features/nav/WhatsNew.tsx
    hash: e157cfc004273cd486b5c4d4346287c1f2ea2646e4e5ca03f826f02791d0eec6
sources_digest: f4aa2922f80b5cb5de5843176c6adf58f9485a73b5525bfa6f1a16fe9f4aecb4
links:
  - to: help-system-integration
    relation: uses
    description: >-
      HelpHub integrates hint dismissal state, onboarding reset, and help panel
      navigation; WhatsNew tracks version changes to drive platform update
      engagement
  - to: lazy-workspace-reset-pattern
    relation: implements
    description: >-
      Uses Redux extraReducers to avoid importing workspace/search/report slices
      directly; those slices independently react to workspaceTabClicked action
  - to: responsive-layout-pattern
    relation: uses
    description: >-
      Adapts navigation UI for small screens: icon-only on desktop hover,
      toggle-button on mobile
  - to: translation-localization
    relation: uses
    description: >-
      nav.config constructs localized menu items via translation function;
      language switching dispatches language toggle actions
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
  - symbol: LegacyNavProps
    kind: type
    at: 'apps/platform/features/nav/LegacyNav.tsx:L24-L26'
  - symbol: LegacyNav
    kind: function
    at: 'apps/platform/features/nav/LegacyNav.tsx:L28-L150'
  - symbol: renderRow
    kind: function
    at: 'apps/platform/features/nav/LegacyNav.tsx:L54-L84'
  - symbol: PlatformNav
    kind: function
    at: 'apps/platform/features/nav/PlatformNav.tsx:L56-L370'
  - symbol: isSectionExpanded
    kind: function
    at: 'apps/platform/features/nav/PlatformNav.tsx:L175-L175'
  - symbol: renderIconAndLabel
    kind: function
    at: 'apps/platform/features/nav/PlatformNav.tsx:L177-L186'
  - symbol: renderItemContent
    kind: function
    at: 'apps/platform/features/nav/PlatformNav.tsx:L188-L242'
  - symbol: renderRow
    kind: function
    at: 'apps/platform/features/nav/PlatformNav.tsx:L244-L254'
  - symbol: renderSection
    kind: function
    at: 'apps/platform/features/nav/PlatformNav.tsx:L256-L315'
  - symbol: parseVersion
    kind: function
    at: 'apps/platform/features/nav/WhatsNew.tsx:L17-L20'
  - symbol: getClientWhatsNewSnapshot
    kind: function
    at: 'apps/platform/features/nav/WhatsNew.tsx:L24-L31'
  - symbol: getServerWhatsNewSnapshot
    kind: function
    at: 'apps/platform/features/nav/WhatsNew.tsx:L33-L35'
  - symbol: dismissWhatsNewSnapshot
    kind: function
    at: 'apps/platform/features/nav/WhatsNew.tsx:L37-L40'
  - symbol: WhatsNew
    kind: function
    at: 'apps/platform/features/nav/WhatsNew.tsx:L42-L79'
  - symbol: dismissNewVersionHint
    kind: function
    at: 'apps/platform/features/nav/WhatsNew.tsx:L55-L58'
  - symbol: TFunc
    kind: type
    at: 'apps/platform/features/nav/nav.config.ts:L13-L13'
  - symbol: NavItem
    kind: type
    at: 'apps/platform/features/nav/nav.config.ts:L15-L38'
  - symbol: RoutedNavItem
    kind: type
    at: 'apps/platform/features/nav/nav.config.ts:L40-L40'
  - symbol: isRouted
    kind: function
    at: 'apps/platform/features/nav/nav.config.ts:L42-L44'
  - symbol: getCategoryItems
    kind: function
    at: 'apps/platform/features/nav/nav.config.ts:L47-L54'
  - symbol: helpHubSectionParams
    kind: function
    at: 'apps/platform/features/nav/nav.config.ts:L56-L56'
  - symbol: getPlatformNavSections
    kind: function
    at: 'apps/platform/features/nav/nav.config.ts:L58-L147'
  - symbol: getPlatformBottomSections
    kind: function
    at: 'apps/platform/features/nav/nav.config.ts:L149-L208'
  - symbol: useOpenFeedbackModal
    kind: function
    at: 'apps/platform/features/nav/nav.hooks.ts:L38-L47'
  - symbol: useNavLinkContext
    kind: function
    at: 'apps/platform/features/nav/nav.hooks.ts:L50-L112'
  - symbol: useIsNavItemActive
    kind: function
    at: 'apps/platform/features/nav/nav.hooks.ts:L115-L150'
  - symbol: NavLinkContext
    kind: type
    at: 'apps/platform/features/nav/nav.links.ts:L19-L27'
  - symbol: NavLinkProps
    kind: type
    at: 'apps/platform/features/nav/nav.links.ts:L29-L35'
  - symbol: workspaceParams
    kind: function
    at: 'apps/platform/features/nav/nav.links.ts:L54-L57'
  - symbol: getNavLinkProps
    kind: function
    at: 'apps/platform/features/nav/nav.links.ts:L100-L112'
  - symbol: isNavItemCurrentLocation
    kind: function
    at: 'apps/platform/features/nav/nav.links.ts:L115-L117'
---

<!-- context:generated:start -->

## Summary

Provides two navigation UI patterns (PlatformNav expanding rail and LegacyNav icon sidebar) that manage dynamic menu construction, workspace navigation, and active state tracking. Decouples navigation from dependent slices via Redux actions to keep nav's dependency graph lightweight on every route render.

## Related

- uses [[help-system-integration]] — HelpHub integrates hint dismissal state, onboarding reset, and help panel navigation; WhatsNew tracks version changes to drive platform update engagement
- implements [[lazy-workspace-reset-pattern]] — Uses Redux extraReducers to avoid importing workspace/search/report slices directly; those slices independently react to workspaceTabClicked action
- uses [[responsive-layout-pattern]] — Adapts navigation UI for small screens: icon-only on desktop hover, toggle-button on mobile
- uses [[translation-localization]] — nav.config constructs localized menu items via translation function; language switching dispatches language toggle actions

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
