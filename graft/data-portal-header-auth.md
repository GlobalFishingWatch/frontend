---
name: Data Portal Header & Auth
slug: data-portal-header-auth
type: system
sources:
  - path: apps/data-download-portal/src/components/header/header.tsx
    hash: 749cea14c1a35b166155df63ab3e88c4fbdb0d5a5d545e95bacad85a1842a22b
  - path: apps/data-download-portal/src/components/topBar/topBar.tsx
    hash: 31ff66139acb2137ec515da150574a9b35db68058108fa3caecd241ce669b48e
sources_digest: 054e1ef1501c59226202aa1ead645c7486853a2b47088331fd43bd26ac0e2a55
links:
  - to: data-portal-loader-component
    relation: uses
    description: TopBar displays Loader during useGFWLogin async fetch
generator:
  version: 1
covers:
  - symbol: HeaderComponent
    kind: function
    at: 'apps/data-download-portal/src/components/header/header.tsx:L9-L38'
  - symbol: handleLoginRedirect
    kind: function
    at: 'apps/data-download-portal/src/components/header/header.tsx:L12-L16'
  - symbol: handleSettingsRedirect
    kind: function
    at: 'apps/data-download-portal/src/components/header/header.tsx:L17-L19'
  - symbol: TopBarProps
    kind: interface
    at: 'apps/data-download-portal/src/components/topBar/topBar.tsx:L11-L13'
  - symbol: TopBar
    kind: function
    at: 'apps/data-download-portal/src/components/topBar/topBar.tsx:L15-L56'
  - symbol: handleLoginRedirect
    kind: function
    at: 'apps/data-download-portal/src/components/topBar/topBar.tsx:L17-L21'
---

<!-- context:generated:start -->

## Summary

Top-level navigation and authentication UI. TopBar displays login state (Loader, logged-out prompt, or logged-in email/logout); Header wraps UIHeader with login/settings/logout handlers and dataset detail breadcrumb.

## Related

- uses [[data-portal-loader-component]] — TopBar displays Loader during useGFWLogin async fetch

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
