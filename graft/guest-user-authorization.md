---
name: Guest User Authorization
slug: guest-user-authorization
type: concept
sources:
  - path: apps/platform/features/_user/vessel-groups/VesselGroupAddButton.tsx
    hash: d87a999f60f0a4a4d37d4cd9a546f68f963a1cad1255be581360d03b561bcc57
  - path: apps/platform/features/_user/vessel-groups/VesselGroupListTooltip.tsx
    hash: 6a1f3e97f193853c947403f394916a9541cae5f03717b411ac7801467415d13d
  - path: apps/platform/features/_vessels/search/advanced/SearchAdvanced.tsx
    hash: c23b1c28dbd266787de63f60f9915bc6dcf94ffaede15d29aaedd6b640e2c34a
  - path: apps/platform/features/_vessels/search/search.selectors.ts
    hash: fd4251d03d8e0b9e42a37745bbb797fbf136dff0795bc138726f71314442eb56
  - path: apps/platform/features/_vessels/search/SearchPlaceholders.tsx
    hash: fd75e4707f2109a6ad542162103fdef40df963ed6b08c7bc83672dfcebbae732
sources_digest: d4b4dc3ed754799634650d0e58b90df975a334f60242b447a2c2e33db8a5d0fa
links:
  - to: vessel-groups-ui-layer
    relation: validates
    description: >-
      Guest users cannot open vessel group modals or popovers; selectIsGuestUser
      gates the add workflow
  - to: vessel-search-system
    relation: validates
    description: >-
      selectIsGuestUser checked in multiple search components to disable
      advanced mode and show restricted data messages
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
  - symbol: SearchPlaceholderProps
    kind: type
    at: 'apps/platform/features/_vessels/search/SearchPlaceholders.tsx:L21-L24'
  - symbol: SearchPlaceholder
    kind: function
    at: 'apps/platform/features/_vessels/search/SearchPlaceholders.tsx:L26-L32'
  - symbol: SearchNoResultsState
    kind: function
    at: 'apps/platform/features/_vessels/search/SearchPlaceholders.tsx:L34-L49'
  - symbol: SearchEmptyState
    kind: function
    at: 'apps/platform/features/_vessels/search/SearchPlaceholders.tsx:L52-L102'
  - symbol: SearchNotAllowed
    kind: function
    at: 'apps/platform/features/_vessels/search/SearchPlaceholders.tsx:L104-L111'
  - symbol: SearchAdvanced
    kind: function
    at: >-
      apps/platform/features/_vessels/search/advanced/SearchAdvanced.tsx:L42-L192
  - symbol: handleSearchQueryChange
    kind: function
    at: >-
      apps/platform/features/_vessels/search/advanced/SearchAdvanced.tsx:L96-L100
  - symbol: handleSearchIdChange
    kind: function
    at: >-
      apps/platform/features/_vessels/search/advanced/SearchAdvanced.tsx:L102-L104
  - symbol: filterDatasetByPermissions
    kind: function
    at: 'apps/platform/features/_vessels/search/search.selectors.ts:L85-L97'
  - symbol: selectSearchDatasetsInWorkspaceByType
    kind: function
    at: 'apps/platform/features/_vessels/search/search.selectors.ts:L99-L111'
---

<!-- context:generated:start -->

## Summary

Guest users (not authenticated or with guest role) have reduced feature access: cannot use advanced search, cannot modify vessel groups, and see filtered dataset lists with authentication prompts.

## Related

- validates [[vessel-groups-ui-layer]] — Guest users cannot open vessel group modals or popovers; selectIsGuestUser gates the add workflow
- validates [[vessel-search-system]] — selectIsGuestUser checked in multiple search components to disable advanced mode and show restricted data messages

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
