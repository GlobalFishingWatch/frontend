---
name: Clipboard Utilities
slug: clipboard-utilities
type: system
sources:
  - path: apps/api-portal/src/app/clipboard.hooks.ts
    hash: 285d28cffef078d363eaf55f4b12ac05ae9e4fcf599c828a5cd0550b6475022e
  - path: apps/api-portal/src/lib/clipboard.ts
    hash: 9a60273d8ebe3a2600543ce525cdd59f56dd4fb20e142d27b1778c8e569cb854
sources_digest: 797a84c7c184925006d25541107b16846daaea0f3fc49ea2098692ec3278b031
links:
  - to: access-token-management-ui
    relation: produces
    description: >-
      Hook exposes copyToClipboard callback and showClipboardNotification
      selector for UI integration
generator:
  version: 1
covers:
  - symbol: ClipboardNotification
    kind: type
    at: 'apps/api-portal/src/app/clipboard.hooks.ts:L4-L6'
  - symbol: useClipboardNotification
    kind: function
    at: 'apps/api-portal/src/app/clipboard.hooks.ts:L8-L38'
  - symbol: copyToClipboard
    kind: function
    at: 'apps/api-portal/src/lib/clipboard.ts:L1-L9'
---

<!-- context:generated:start -->

## Summary

Clipboard management hook and underlying utility. useClipboardNotification tracks recently copied strings and displays temporary feedback; copyToClipboard uses deprecated execCommand API with DOM manipulation.

## Related

- produces [[access-token-management-ui]] — Hook exposes copyToClipboard callback and showClipboardNotification selector for UI integration

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
