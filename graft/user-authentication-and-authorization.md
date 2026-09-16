---
name: User Authentication and Authorization
slug: user-authentication-and-authorization
type: concept
sources:
  - path: apps/platform/data/map/config.ts
    hash: 488f6283103214b26296af4de444c1e41e86e10f8a63301f06cd95ac3e998a9a
  - path: apps/platform/features/_map/content-panel/chat/ChatContainer.tsx
    hash: 159cfd9c2b258d6bff4fe06a351b6fdae78eef3259f11af03c7e6cb8184115d9
  - path: apps/platform/features/_map/datasets/DatasetLabel.tsx
    hash: 4820c187ff40d79fe11961e28b8034d680b3e52e864105f5358eda3d78d40c5c
sources_digest: 0265f02e819e7ac26e0e63610ec04bf45c6ea042be5e2a04d35204ed448915a0
links:
  - to: redux-state-management
    relation: uses
    description: >-
      User state selectors (selectIsGuestUser, selectIsGFWUser, selectUserId)
      are stored in Redux
generator:
  version: 1
covers:
  - symbol: EncounterAuthorizedEventType
    kind: type
    at: 'apps/platform/data/map/config.ts:L141-L142'
  - symbol: ChatContainer
    kind: function
    at: 'apps/platform/features/_map/content-panel/chat/ChatContainer.tsx:L11-L37'
  - symbol: DatasetLabelProps
    kind: type
    at: 'apps/platform/features/_map/datasets/DatasetLabel.tsx:L7-L7'
  - symbol: DatasetLabel
    kind: function
    at: 'apps/platform/features/_map/datasets/DatasetLabel.tsx:L8-L18'
---

<!-- context:generated:start -->

## Summary

Feature-access control via Redux selectors (selectIsGuestUser, selectIsGFWUser, selectUserId) that gate feature availability by user tier. Chat and GFW-only content display permission state; feature flags (IS_CHATBOT_ENABLED) provide additional runtime control over feature visibility.

## Related

- uses [[redux-state-management]] — User state selectors (selectIsGuestUser, selectIsGFWUser, selectUserId) are stored in Redux

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
