---
name: App Configuration & Initialization
slug: app-configuration-initialization
type: system
sources:
  - path: apps/platform/features/app/app-shell.hooks.ts
    hash: bf6d4452da0b4a931bccfbbd71ef3ba9d34fee05ae13923815a6fb3ca90d84b1
  - path: apps/platform/features/app/app-store.hooks.ts
    hash: 2b45ec7e93d17dc27e11c7b1baba46adfb51bf5c43284488be1a26994130f9b3
  - path: apps/platform/features/app/app.config.ts
    hash: 0c5c8fdbbd7d6d33f9c25b83fa9712fb9f9c69a974bc563902a1f0d0c3c9a9a9
  - path: apps/platform/features/app/cookies.config.ts
    hash: fcef71676f24e36a40289708b2004e98e9d9ae4c024096589dac75c72483074c
sources_digest: 188404498c243fe50444ea480ea33dad045cc56e86238914abce68de0c7c440e
links:
  - to: analytics-tracking
    relation: uses
    description: useAppShell aggregates analytics initialization via useAnalytics hook
  - to: i18n-localization
    relation: uses
    description: >-
      app-store.hooks.ts initializes language via setUserLanguage;
      app-shell.hooks.ts calls useUserLanguageUpdate to keep i18n in sync
  - to: router-integration
    relation: depends_on
    description: >-
      app-store.hooks.ts critically depends on TanStack Router for SSR-safe
      state synchronization; app-shell.hooks.ts uses router utilities for
      initialization
  - to: user-authentication-session
    relation: uses
    description: >-
      app-store.hooks.ts dispatches setLoggedUser and syncs user language;
      app-shell.hooks.ts coordinates user updates and login listeners
  - to: workspace-map-data
    relation: uses
    description: >-
      app-shell.hooks.ts triggers workspace data loading via
      useEnsureWorkspaceLoad; app-store.hooks.ts syncs router state with Redux
      for map navigation
generator:
  version: 1
covers:
  - symbol: useAppShell
    kind: function
    at: 'apps/platform/features/app/app-shell.hooks.ts:L11-L21'
  - symbol: useAppStore
    kind: function
    at: 'apps/platform/features/app/app-store.hooks.ts:L34-L64'
  - symbol: PanelWidths
    kind: type
    at: 'apps/platform/features/app/cookies.config.ts:L10-L10'
---

<!-- context:generated:start -->

## Summary

Centralized app-level setup: store creation, router-Redux synchronization, global hook orchestration, color theming, and cookie configuration. Ensures the app shell and all dependent subsystems (analytics, user state, workspace data) initialize in correct order with SSR safety.

## Related

- uses [[analytics-tracking]] — useAppShell aggregates analytics initialization via useAnalytics hook
- uses [[i18n-localization]] — app-store.hooks.ts initializes language via setUserLanguage; app-shell.hooks.ts calls useUserLanguageUpdate to keep i18n in sync
- depends on [[router-integration]] — app-store.hooks.ts critically depends on TanStack Router for SSR-safe state synchronization; app-shell.hooks.ts uses router utilities for initialization
- uses [[user-authentication-session]] — app-store.hooks.ts dispatches setLoggedUser and syncs user language; app-shell.hooks.ts coordinates user updates and login listeners
- uses [[workspace-map-data]] — app-shell.hooks.ts triggers workspace data loading via useEnsureWorkspaceLoad; app-store.hooks.ts syncs router state with Redux for map navigation

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
