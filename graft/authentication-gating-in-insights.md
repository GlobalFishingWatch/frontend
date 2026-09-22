---
name: Authentication Gating in Insights
slug: authentication-gating-in-insights
type: concept
sources:
  - path: apps/platform/features/_vessels/vessel/insights/InsightFlagChanges.tsx
    hash: 71c7374ad53edea61feec62e926e2da7cd6096e9e52a65d883a407cb456bbfa7
  - path: apps/platform/features/_vessels/vessel/insights/InsightMOUList.tsx
    hash: d1ad08f6a3d490be40a329f76a7d27ac112f19884d776da0d92daefc84279ae0
sources_digest: 14b5350be80f7766d1328e16e26f2474833dfe2107315ed03db8288059121266
links:
  - to: vessel-insights-display-system
    relation: part_of
    description: >-
      Authentication gating is applied selectively to sensitive insight types to
      protect proprietary data
generator:
  version: 1
covers:
  - symbol: InsightFlagChanges
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/insights/InsightFlagChanges.tsx:L17-L70
  - symbol: InsightMOUList
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/insights/InsightMOUList.tsx:L17-L194
  - symbol: getMOUListAppearance
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/insights/InsightMOUList.tsx:L68-L172
---

<!-- context:generated:start -->

## Summary

Pattern restricting sensitive insight data (flag changes, MOU lists) to authenticated users, displaying login prompts via VesselIdentityFieldLogin for guests. InsightFlagChanges and InsightMOUList check selectIsGuestUser and conditionally render VesselIdentityFieldLogin if true. Constraint: authentication status must be evaluated before rendering data to enforce consistent access control.

## Related

- part of [[vessel-insights-display-system]] — Authentication gating is applied selectively to sensitive insight types to protect proprietary data

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
