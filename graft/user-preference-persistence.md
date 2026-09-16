---
name: User Preference Persistence
slug: user-preference-persistence
type: system
sources:
  - path: apps/platform/features/_user/user.slice.ts
    hash: dc4628bba5d3ef124fbaad479bbeeed8049e83fe262c682e21b2a048c85118c3
sources_digest: 533d98d4fb0b418f7387ac8425c5ef9189f921d1af20df5c47f0efb2800efe4f
links:
  - to: user-authorization-permissions-system
    relation: depends_on
    description: >-
      selectUserLanguage reads persisted language preference; selectUserData
      includes settings object
generator:
  version: 1
covers:
  - symbol: UserSettings
    kind: interface
    at: 'apps/platform/features/_user/user.slice.ts:L16-L18'
  - symbol: UserState
    kind: interface
    at: 'apps/platform/features/_user/user.slice.ts:L20-L27'
---

<!-- context:generated:start -->

## Summary

Stores user settings (visualization mode, language preference) in localStorage via setUserSetting and recovers them via initialState function in user.slice. Settings are persisted per-user via getLocalStorageItem/setLocalStorageItem utilities, enabling offline-first preference recovery across sessions.

## Related

- depends on [[user-authorization-permissions-system]] — selectUserLanguage reads persisted language preference; selectUserData includes settings object

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
