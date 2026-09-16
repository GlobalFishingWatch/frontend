---
name: Highlight Animation & Change Tracking
slug: highlight-animation-change-tracking
type: concept
sources:
  - path: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityField.tsx
    hash: aafdb7aedb67d839e24e478033bc86c062aeed039bdcfeff6f39d6e08f8b0eed
sources_digest: 525dd36f72f948922d80f8b326f8d6a6af6b63a40179ed70b013480fc4170dc1
links:
  - to: vessel-identity-field-rendering
    relation: part_of
    description: >-
      Highlight animation provides visual feedback when vessel identity values
      update dynamically
generator:
  version: 1
covers:
  - symbol: VesselIdentityFieldProps
    kind: type
    at: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityField.tsx:L11-L15
  - symbol: VesselIdentityField
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityField.tsx:L16-L53
---

<!-- context:generated:start -->

## Summary

Design pattern in VesselIdentityField using prevValue ref and dual useLayoutEffect/useEffect hooks to detect value changes and trigger a 4-second highlight animation, ensuring CSS animation reruns correctly even on rapid successive updates. useLayoutEffect resets highlight state before new value is processed; useEffect applies highlight class and schedules cleanup timer. Constraint: timer cleanup must prevent memory leaks if component unmounts during animation.

## Related

- part of [[vessel-identity-field-rendering]] — Highlight animation provides visual feedback when vessel identity values update dynamically

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
