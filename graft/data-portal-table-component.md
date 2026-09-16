---
name: Data Portal Table Component
slug: data-portal-table-component
type: system
sources:
  - path: apps/data-download-portal/src/components/table/table.tsx
    hash: d264086a8ba277e72e323853b1d62e25a4145a478b196cd87a1d9d6d33cb3a19
sources_digest: 5e182d2e0c82d0c3efafd779a6ffcd87e71984511b09b81c59eeebed346cd4d0
links:
  - to: data-portal-configuration
    relation: depends_on
    description: Respects MAX_DOWNLOAD_FILES_LIMIT and DISABLE_DOWNLOAD_SURVEY config
  - to: data-portal-header-auth
    relation: depends_on
    description: Checks logged-in status and user data before allowing downloads
  - to: download-modal-survey
    relation: uses
    description: >-
      Table manages download modal state and passes user data for survey
      submission
generator:
  version: 1
covers:
  - symbol: TableData
    kind: type
    at: 'apps/data-download-portal/src/components/table/table.tsx:L54-L61'
  - symbol: ExtendedTableState
    kind: type
    at: 'apps/data-download-portal/src/components/table/table.tsx:L63-L67'
  - symbol: TableInstanceWithHooks
    kind: type
    at: 'apps/data-download-portal/src/components/table/table.tsx:L69-L73'
  - symbol: ExtendedHeaderGroup
    kind: type
    at: 'apps/data-download-portal/src/components/table/table.tsx:L75-L77'
  - symbol: ExtendedRow
    kind: type
    at: 'apps/data-download-portal/src/components/table/table.tsx:L79-L79'
  - symbol: IndeterminateCheckboxProps
    kind: type
    at: 'apps/data-download-portal/src/components/table/table.tsx:L81-L84'
  - symbol: fuzzyTextFilterFn
    kind: function
    at: 'apps/data-download-portal/src/components/table/table.tsx:L109-L144'
  - symbol: collectAllRows
    kind: function
    at: 'apps/data-download-portal/src/components/table/table.tsx:L112-L119'
  - symbol: rowMatches
    kind: function
    at: 'apps/data-download-portal/src/components/table/table.tsx:L129-L138'
  - symbol: HighlightedCellProps
    kind: type
    at: 'apps/data-download-portal/src/components/table/table.tsx:L148-L153'
  - symbol: HighlightedCell
    kind: function
    at: 'apps/data-download-portal/src/components/table/table.tsx:L155-L170'
  - symbol: TableRowItemProps
    kind: type
    at: 'apps/data-download-portal/src/components/table/table.tsx:L172-L178'
  - symbol: TableRowItem
    kind: function
    at: 'apps/data-download-portal/src/components/table/table.tsx:L180-L214'
  - symbol: TableProps
    kind: type
    at: 'apps/data-download-portal/src/components/table/table.tsx:L216-L221'
  - symbol: Table
    kind: function
    at: 'apps/data-download-portal/src/components/table/table.tsx:L223-L449'
---

<!-- context:generated:start -->

## Summary

Feature-rich virtualized data table for browsing hierarchical datasets. Supports filtering (fuzzy search), sorting, multi-select with tri-state parent-child checkboxes, resizable columns, and post-download surveys.

## Related

- depends on [[data-portal-configuration]] — Respects MAX_DOWNLOAD_FILES_LIMIT and DISABLE_DOWNLOAD_SURVEY config
- depends on [[data-portal-header-auth]] — Checks logged-in status and user data before allowing downloads
- uses [[download-modal-survey]] — Table manages download modal state and passes user data for survey submission

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
