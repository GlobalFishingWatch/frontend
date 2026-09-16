---
name: Error Notification Overlay
slug: error-notification-overlay
type: system
sources:
  - path: >-
      apps/platform/features/_map/map/overlays/error-notification/error-notification.hooks.ts
    hash: 6a953e9dec937132d1a903ef5b39b5094d5fbaf72024e9f02dc81776048742bf
  - path: >-
      apps/platform/features/_map/map/overlays/error-notification/ErrorNotification.tsx
    hash: df8ec3d20cee4067616f2ecd59f8b29aa1d26c09d394ad78b0a72df509d58b81
sources_digest: 4d630181096ad112b277c19632d170ab1228f67f8ffbe265e784b1074ff0a662
links:
  - to: map-popup-system
    relation: uses
    description: Error notification uses PopupWrapper for modal positioning
generator:
  version: 1
covers:
  - symbol: ErrorNotification
    kind: function
    at: >-
      apps/platform/features/_map/map/overlays/error-notification/ErrorNotification.tsx:L20-L119
  - symbol: onClose
    kind: function
    at: >-
      apps/platform/features/_map/map/overlays/error-notification/ErrorNotification.tsx:L28-L32
  - symbol: onConfirmClick
    kind: function
    at: >-
      apps/platform/features/_map/map/overlays/error-notification/ErrorNotification.tsx:L34-L74
  - symbol: useMapErrorNotification
    kind: function
    at: >-
      apps/platform/features/_map/map/overlays/error-notification/error-notification.hooks.ts:L12-L52
---

<!-- context:generated:start -->

## Summary

Allows users to report map errors to backend via `/api/feedback` endpoint. Displays popup with editable error label and confirmation button, collects contextual data (user info, location, timestamp, environment), and submits error reports with guest-user fallbacks for unauthenticated users. Auto-closes on success after 1000ms with error label requirement for submission.

## Related

- uses [[map-popup-system]] — Error notification uses PopupWrapper for modal positioning

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
