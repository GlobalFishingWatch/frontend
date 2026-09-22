---
name: Sidebar Layout & Header Controls
slug: sidebar-layout-header-controls
type: system
sources:
  - path: apps/port-labeler/src/features/sidebar/Sidebar.tsx
    hash: 2872d224a61a92d296532b9b079ca6122c86b20e414e49a614011826e5a1f1a9
  - path: apps/port-labeler/src/features/sidebar/SidebarHeader.tsx
    hash: b6afa1d69ba0ad7f22cea80ee3e355fff1596f7580a99deedbffe82df3714bd9
sources_digest: e849c4f6c99e4b347da1355878462dacd3686d7125517a52cee2600c7e5abce7
links:
  - to: file-i-o-country-level-filtering
    relation: uses
    description: >-
      SidebarHeader wires useSelectedTracksConnect for country change handling
      and file operations
  - to: redux-state-management-for-labeler
    relation: uses
    description: >-
      SidebarHeader reads selectCountries, selectCountry from Redux; dispatches
      country selection via onCountryChange
  - to: search-point-discovery
    relation: uses
    description: SidebarHeader renders Search component for point filtering
  - to: table-anchorage-editing-interface
    relation: part_of
    description: Sidebar composes TableAnchorage as its main content area
generator:
  version: 1
covers:
  - symbol: Sidebar
    kind: function
    at: 'apps/port-labeler/src/features/sidebar/Sidebar.tsx:L7-L16'
  - symbol: HeaderProps
    kind: interface
    at: 'apps/port-labeler/src/features/sidebar/SidebarHeader.tsx:L15-L17'
  - symbol: SidebarHeader
    kind: function
    at: 'apps/port-labeler/src/features/sidebar/SidebarHeader.tsx:L18-L79'
---

<!-- context:generated:start -->

## Summary

Two-part sidebar container: Sidebar wraps scrollable TableAnchorage content, while SidebarHeader provides top-level navigation including country selection dropdown (with flags via i18n-labels), Search component, and file operation buttons (upload/download). SidebarHeader integrates with Redux for country state and uses custom hook useSelectedTracksConnect to wire file handlers.

## Related

- uses [[file-i-o-country-level-filtering]] — SidebarHeader wires useSelectedTracksConnect for country change handling and file operations
- uses [[redux-state-management-for-labeler]] — SidebarHeader reads selectCountries, selectCountry from Redux; dispatches country selection via onCountryChange
- uses [[search-point-discovery]] — SidebarHeader renders Search component for point filtering
- part of [[table-anchorage-editing-interface]] — Sidebar composes TableAnchorage as its main content area

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
