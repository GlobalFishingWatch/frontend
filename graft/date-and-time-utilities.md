---
name: Date and Time Utilities
slug: date-and-time-utilities
type: file
sources:
  - path: apps/platform/utils/dates.ts
    hash: 8c8737578ca2aa85900803dd6cfa871fe2e6f7dad336ec57c7763e5f2c40375e
sources_digest: 4cbd24c45493fd7876f43e1d7db42c98283e2593264cb5d191a7758a17d3662f
links: []
generator:
  version: 1
covers:
  - symbol: getFlooredMinute
    kind: function
    at: 'apps/platform/utils/dates.ts:L13-L19'
  - symbol: getRealTimeLatestAvailableDataDate
    kind: function
    at: 'apps/platform/utils/dates.ts:L21-L26'
  - symbol: getMsUntilNextRealTimeUpdate
    kind: function
    at: 'apps/platform/utils/dates.ts:L28-L36'
  - symbol: UserCreatedEntities
    kind: type
    at: 'apps/platform/utils/dates.ts:L38-L38'
  - symbol: sortByCreationDate
    kind: function
    at: 'apps/platform/utils/dates.ts:L40-L45'
  - symbol: getTimeAgo
    kind: function
    at: 'apps/platform/utils/dates.ts:L49-L61'
  - symbol: getDateLabel
    kind: function
    at: 'apps/platform/utils/dates.ts:L63-L67'
  - symbol: isTimestampNumber
    kind: function
    at: 'apps/platform/utils/dates.ts:L69-L72'
  - symbol: pickDateFormatByPrecision
    kind: function
    at: 'apps/platform/utils/dates.ts:L76-L78'
  - symbol: pickDateFormatByRange
    kind: function
    at: 'apps/platform/utils/dates.ts:L80-L84'
---

<!-- context:generated:start -->

## Summary

Date handling and formatting functions for map features and data. Built on Luxon for timezone-safe manipulation. Exports functions for real-time data update scheduling (aligning to REAL_TIME_DATA_UPDATE_INTERVAL_MINUTES boundaries), creation date sorting, relative time string generation via i18n, and intelligent date format selection based on data precision or time range.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
