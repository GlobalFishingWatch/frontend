---
name: GFWOnly Access Control Wrapper
slug: gfwonly-access-control-wrapper
type: file
sources:
  - path: apps/platform/features/_user/GFWOnly.tsx
    hash: 514c793b35522a3b324895b1f8377d58dd98432ea033785db1092594faec0c4f
sources_digest: e2ea1d3528bdb50971fbf1091360403ff20e4997c57b294508370e38fb2c7eef
links:
  - to: authentication-and-access-control
    relation: implements
    description: >-
      GFWOnly provides UI primitive for restricting sensitive features to staff,
      used across reports and vessel insights
generator:
  version: 1
covers:
  - symbol: GFWOnlyProps
    kind: type
    at: 'apps/platform/features/_user/GFWOnly.tsx:L12-L18'
  - symbol: GFWOnly
    kind: function
    at: 'apps/platform/features/_user/GFWOnly.tsx:L26-L69'
---

<!-- context:generated:start -->

## Summary

Conditional rendering component that gates content to GFW and JAC staff via selectIsGFWUser and selectIsJACUser selectors. Supports flexible rendering modes (icon+label or icon-only) and user group filtering ('gfw', 'jac', 'any'). Returns null for non-authenticated users with appropriate localized messages and fallback icon rendering.

## Related

- implements [[authentication-and-access-control]] — GFWOnly provides UI primitive for restricting sensitive features to staff, used across reports and vessel insights

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
