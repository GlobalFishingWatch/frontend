---
name: Workspace Navigation and Access Control
slug: workspace-navigation-and-access-control
type: system
sources:
  - path: apps/platform/test/integration/MarineManager.spec.tsx
    hash: 5f0e8e32260002be155e72391b04a41645691407ac9c58f1bfcdec21d6481139
  - path: apps/platform/test/integration/PrivateWorkspace.spec.tsx
    hash: 772fb051a747e21a9a917f8a7f84a451a43d4ba58ece6e680f1d9bec68d3b064
sources_digest: 5fb98263d332c408c1c6a63128f398df90a47e6695375a08f206f6b031077123
links:
  - to: test-infrastructure-and-utilities
    relation: depends_on
    description: 'Uses render(), makeStore(), and Jotai store setup for state verification'
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Validates workspace navigation (marine manager, private, password-protected) and access control enforcement. Tests verify that unauthenticated users are blocked from private workspaces, password validation occurs client-side, and layer initialization populates deckLayersStateAtom correctly on navigation.

## Related

- depends on [[test-infrastructure-and-utilities]] — Uses render(), makeStore(), and Jotai store setup for state verification

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
