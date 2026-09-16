---
name: Vessel Groups UI Layer
slug: vessel-groups-ui-layer
type: system
sources:
  - path: apps/platform/features/_user/vessel-groups/VesselGroupAddButton.tsx
    hash: d87a999f60f0a4a4d37d4cd9a546f68f963a1cad1255be581360d03b561bcc57
  - path: apps/platform/features/_user/vessel-groups/VesselGroupListTooltip.tsx
    hash: 6a1f3e97f193853c947403f394916a9541cae5f03717b411ac7801467415d13d
  - path: apps/platform/features/_user/vessel-groups/VesselGroupModal.tsx
    hash: 6cf5ccdb8cd465d47cfb4afa0cc366ff1e7c4c95214b659671857308d41a0083
  - path: apps/platform/features/_user/vessel-groups/VesselGroupModalSearch.tsx
    hash: b8285b469648c38e2e648da276b74b0e41936aa57ff98ae4536d2a63602e2c30
  - path: apps/platform/features/_user/vessel-groups/VesselGroupModalVessels.tsx
    hash: 37242623758729636901180532f82ee0df376f1d86f0dc162126d2f10422b111
sources_digest: 5654cf2908bc7995c7711977763f20cb7cc1be927067f10f5ee2af04b7e19eca
links:
  - to: guest-user-authorization
    relation: validates
    description: >-
      Add button and list tooltip disable themselves for guest users via
      selectIsGuestUser check; guest cannot open popover or create/modify groups
  - to: vessel-deduplication-grouping
    relation: uses
    description: >-
      Modal vessels component uses getVesselGroupUniqVessels and
      groupVesselGroupVessels utilities to deduplicate and group vessels by
      identity fields before display
  - to: vessel-search-system
    relation: uses
    description: >-
      Vessel group modal uses advanced search infrastructure (datasets, thunks)
      to discover and hydrate vessel metadata; integrates
      searchVesselGroupsVesselsThunk for async vessel lookup
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
  - symbol: VesselGroupListTooltipProps
    kind: type
    at: >-
      apps/platform/features/_user/vessel-groups/VesselGroupListTooltip.tsx:L24-L30
  - symbol: VesselGroupListTooltip
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/VesselGroupListTooltip.tsx:L32-L133
  - symbol: VesselGroupModal
    kind: function
    at: 'apps/platform/features/_user/vessel-groups/VesselGroupModal.tsx:L101-L759'
  - symbol: VesselGroupSearch
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/VesselGroupModalSearch.tsx:L41-L255
  - symbol: VesselGroupVesselRowProps
    kind: type
    at: >-
      apps/platform/features/_user/vessel-groups/VesselGroupModalVessels.tsx:L37-L43
  - symbol: VesselGroupVesselsComponent
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/VesselGroupModalVessels.tsx:L142-L239
---

<!-- context:generated:start -->

## Summary

Provides modal and button workflows for adding vessels to user-created vessel groups, handling both creation of new groups and addition to existing ones. Manages vessel resolution (pre-resolved or deferred via CSV/ID lists) and workspace integration via dataview instances.

## Related

- validates [[guest-user-authorization]] — Add button and list tooltip disable themselves for guest users via selectIsGuestUser check; guest cannot open popover or create/modify groups
- uses [[vessel-deduplication-grouping]] — Modal vessels component uses getVesselGroupUniqVessels and groupVesselGroupVessels utilities to deduplicate and group vessels by identity fields before display
- uses [[vessel-search-system]] — Vessel group modal uses advanced search infrastructure (datasets, thunks) to discover and hydrate vessel metadata; integrates searchVesselGroupsVesselsThunk for async vessel lookup

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
