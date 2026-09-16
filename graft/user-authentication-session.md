---
name: User Authentication & Session
slug: user-authentication-session
type: system
sources:
  - path: apps/platform/features/app/app.hooks.ts
    hash: 2c47ededca0b14f32af378a05b514d7741c3a0fcf1bde7e65a49e511b01b1255
sources_digest: 618e6e8b42b372ba876d95905591206444ee5c2d2b43cf1bc6eed52408473cda
links:
  - to: analytics-tracking
    relation: produces
    description: >-
      User metadata (id, organization, cohort, groups) enriches analytics
      context
  - to: app-configuration-initialization
    relation: implements
    description: >-
      Provides typed Redux hooks (useAppStore, useAppDispatch, useAppSelector)
      that enforce store type safety across the app
generator:
  version: 1
covers:
  - symbol: useAppDispatch
    kind: function
    at: 'apps/platform/features/app/app.hooks.ts:L9-L9'
---

<!-- context:generated:start -->

## Summary

Redux-based user state management including login status, user metadata (id, organization, cohort, groups), language preference, and GFW developer detection. Supports guest users and handles login/logout flows with browser event listeners.

## Related

- produces [[analytics-tracking]] — User metadata (id, organization, cohort, groups) enriches analytics context
- implements [[app-configuration-initialization]] — Provides typed Redux hooks (useAppStore, useAppDispatch, useAppSelector) that enforce store type safety across the app

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
