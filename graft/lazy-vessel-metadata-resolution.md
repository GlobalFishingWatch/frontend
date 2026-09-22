---
name: Lazy Vessel Metadata Resolution
slug: lazy-vessel-metadata-resolution
type: concept
sources:
  - path: apps/platform/features/_user/vessel-groups/VesselGroupAddButton.tsx
    hash: d87a999f60f0a4a4d37d4cd9a546f68f963a1cad1255be581360d03b561bcc57
  - path: apps/platform/features/_user/vessel-groups/VesselGroupModal.tsx
    hash: 6cf5ccdb8cd465d47cfb4afa0cc366ff1e7c4c95214b659671857308d41a0083
sources_digest: 98146362d423ee1af9ebbde888d9a7740ce7a0f175540f3dc1d19e47790ea6f8
links:
  - to: vessel-groups-ui-layer
    relation: implements
    description: >-
      VesselGroupAddButton accepts vessels (pre-resolved) or vesselsToResolve +
      datasetsToResolve; dispatches searchVesselGroupsVesselsThunk before
      delegating to group creation/addition hooks
generator:
  version: 1
covers:
  - symbol: VesselGroupAddButtonProps
    kind: type
    at: >-
      apps/platform/features/_user/vessel-groups/VesselGroupAddButton.tsx:L27-L34
  - symbol: VesselGroupAddButtonToggleProps
    kind: type
    at: >-
      apps/platform/features/_user/vessel-groups/VesselGroupAddButton.tsx:L36-L44
  - symbol: VesselGroupAddActionButton
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/VesselGroupAddButton.tsx:L46-L84
  - symbol: VesselGroupAddButton
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/VesselGroupAddButton.tsx:L86-L150
  - symbol: VesselGroupModal
    kind: function
    at: 'apps/platform/features/_user/vessel-groups/VesselGroupModal.tsx:L101-L759'
---

<!-- context:generated:start -->

## Summary

Vessels can be passed pre-resolved or as IDs with datasets for async lookup. Modal dispatches searchVesselGroupsVesselsThunk to hydrate metadata (identity, dataset associations) before display. Enables deferred loading in workflows where vessel IDs are known but details must be fetched.

## Related

- implements [[vessel-groups-ui-layer]] — VesselGroupAddButton accepts vessels (pre-resolved) or vesselsToResolve + datasetsToResolve; dispatches searchVesselGroupsVesselsThunk before delegating to group creation/addition hooks

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
