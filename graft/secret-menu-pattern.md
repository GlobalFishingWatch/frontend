---
name: Secret Menu Pattern
slug: secret-menu-pattern
type: concept
sources:
  - path: apps/platform/hooks/secret-menu.hooks.ts
    hash: 7a4c13f72d74a46ba5849a6bb0f1d4251af77d290c65511e12dfa740821bca7e
sources_digest: 7e2cf0a51b59ab56c1659671f8f601cbc19b8d4135edb1f228a65a948decaec9
links:
  - to: modal-system
    relation: uses
    description: Secret menus dispatch modal state changes to open debug/admin dialogs
generator:
  version: 1
covers:
  - symbol: DebugMenu
    kind: type
    at: 'apps/platform/hooks/secret-menu.hooks.ts:L8-L8'
  - symbol: SecretMenuProps
    kind: type
    at: 'apps/platform/hooks/secret-menu.hooks.ts:L10-L28'
  - symbol: useSecretKeyboardCombo
    kind: function
    at: 'apps/platform/hooks/secret-menu.hooks.ts:L30-L98'
  - symbol: useSecretMenu
    kind: function
    at: 'apps/platform/hooks/secret-menu.hooks.ts:L100-L114'
---

<!-- context:generated:start -->

## Summary

Easter-egg debug menus triggered by keyboard shortcuts (d for debug, e for editor, b for BigQuery) that only activate for GFW/JAC users or localhost. Implements two activation modes: sequential key typing or repeated key presses, with 2-second reset window and ref-based state tracking to avoid stale closures.

## Related

- uses [[modal-system]] — Secret menus dispatch modal state changes to open debug/admin dialogs

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
