---
name: Overlay UI State Management
slug: overlay-ui-state-management
type: concept
sources:
  - path: apps/platform/features/_map/map/overlays/overlays-hooks.ts
    hash: ccf9404003b81d92122881b053c78668908cf7849a3d8f95cbfc28fe5a0f8c7b
sources_digest: e21d5e0506938b2236c56bbec4a86e325046aa8b4aecae278893d73ca9c0e163
links:
  - to: annotation-system
    relation: uses
    description: Annotations use overlaysCursorAtom to show grab cursor during drag
  - to: track-corrections-overlay
    relation: uses
    description: Track corrections use overlaysCursorAtom for hover cursor feedback
generator:
  version: 1
covers:
  - symbol: OverlaysCursor
    kind: type
    at: 'apps/platform/features/_map/map/overlays/overlays-hooks.ts:L3-L3'
---

<!-- context:generated:start -->

## Summary

Jotai atom (overlaysCursorAtom) manages cursor styles applied to map overlay components, representing interaction states (pointer, grab, move, default). Enables reactive cursor updates across annotation drag, ruler interaction, and track-correction hover operations without prop drilling. Initialized to empty string (default cursor).

## Related

- uses [[annotation-system]] — Annotations use overlaysCursorAtom to show grab cursor during drag
- uses [[track-corrections-overlay]] — Track corrections use overlaysCursorAtom for hover cursor feedback

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
