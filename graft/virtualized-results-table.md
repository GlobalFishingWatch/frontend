---
name: Virtualized Results Table
slug: virtualized-results-table
type: concept
sources:
  - path: apps/platform/features/_vessels/search/advanced/SearchAdvancedResults.tsx
    hash: 1638654c38365f644d25cb92ae0984e94fbed32fbd8012f3f1aa0e27801e49f2
sources_digest: a2f701466fb7c8968923d7790566c4d5c5c64c9a45ca53a2b29ecc85ea762cf6
links:
  - to: vessel-search-system
    relation: implements
    description: >-
      SearchAdvancedResults uses useVirtualizer for O(visible rows) rendering;
      columnHelper defines dynamic columns with pinning and sizing; column order
      persisted via useLocalStorage
generator:
  version: 1
covers:
  - symbol: SearchTable
    kind: type
    at: >-
      apps/platform/features/_vessels/search/advanced/SearchAdvancedResults.tsx:L91-L91
  - symbol: VesselDataviewRef
    kind: type
    at: >-
      apps/platform/features/_vessels/search/advanced/SearchAdvancedResults.tsx:L92-L92
  - symbol: isVesselInWorkspace
    kind: function
    at: >-
      apps/platform/features/_vessels/search/advanced/SearchAdvancedResults.tsx:L94-L102
  - symbol: canSelectVessel
    kind: function
    at: >-
      apps/platform/features/_vessels/search/advanced/SearchAdvancedResults.tsx:L104-L114
  - symbol: columnSizeStyle
    kind: function
    at: >-
      apps/platform/features/_vessels/search/advanced/SearchAdvancedResults.tsx:L116-L118
  - symbol: SelectAllCheckbox
    kind: function
    at: >-
      apps/platform/features/_vessels/search/advanced/SearchAdvancedResults.tsx:L120-L144
  - symbol: SearchAdvancedResultRow
    kind: function
    at: >-
      apps/platform/features/_vessels/search/advanced/SearchAdvancedResults.tsx:L146-L181
  - symbol: SearchAdvancedResultsBody
    kind: function
    at: >-
      apps/platform/features/_vessels/search/advanced/SearchAdvancedResults.tsx:L183-L230
  - symbol: SearchAdvancedResults
    kind: function
    at: >-
      apps/platform/features/_vessels/search/advanced/SearchAdvancedResults.tsx:L232-L760
  - symbol: writeColumnSizeVars
    kind: function
    at: >-
      apps/platform/features/_vessels/search/advanced/SearchAdvancedResults.tsx:L638-L646
---

<!-- context:generated:start -->

## Summary

Large vessel result sets (potentially thousands) are rendered efficiently via TanStack React Table with row virtualization, dynamic column management (reordering, resizing), and pinned columns (vessel name, selection checkbox). ROW_HEIGHT_ESTIMATE (80px) drives virtual scroller precision.

## Related

- implements [[vessel-search-system]] — SearchAdvancedResults uses useVirtualizer for O(visible rows) rendering; columnHelper defines dynamic columns with pinning and sizing; column order persisted via useLocalStorage

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
