---
name: Download Validation & Format Selection
slug: download-validation-format-selection
type: concept
sources:
  - path: apps/platform/features/_map/download/download.utils.ts
    hash: 363f364d7bcd5af41008d38189b7536f07a426f805518c7ee75914bcb04a2ef3
  - path: apps/platform/features/_map/download/downloadActivity.config.ts
    hash: 5fa1289c51152a015e4b82aad18a2ebca70f2a0388a2f40b289151818dd07d23
  - path: apps/platform/features/_map/download/downloadTrack.config.ts
    hash: 6895035854d063d93b42c4f84795964fb9cbf21c62bf2caf9e9a540b02499283
sources_digest: 0696d6138c801bbeb02c44968f0024693c0e615bdf613655a73026041adfce61
links:
  - to: download-state-workflow-orchestration
    relation: depends_on
    description: >-
      downloadActivity.slice reads from downloadActivity.config for enum
      definitions and validates via download.utils before dispatch.
  - to: download-ui-form-components
    relation: implements
    description: >-
      Download components call these validation and option-building functions to
      render filtered choices and disable incompatible combinations.
generator:
  version: 1
covers:
  - symbol: getDownloadReportSupported
    kind: function
    at: 'apps/platform/features/_map/download/download.utils.ts:L32-L40'
  - symbol: getSupportedGroupByOptions
    kind: function
    at: 'apps/platform/features/_map/download/download.utils.ts:L42-L96'
  - symbol: hasDataviewWithIntervalSupported
    kind: function
    at: 'apps/platform/features/_map/download/download.utils.ts:L101-L121'
  - symbol: getSupportedTemporalResolutions
    kind: function
    at: 'apps/platform/features/_map/download/download.utils.ts:L123-L172'
  - symbol: HeatmapDownloadTab
    kind: enum
    at: 'apps/platform/features/_map/download/downloadActivity.config.ts:L5-L9'
  - symbol: HeatmapDownloadFormat
    kind: enum
    at: 'apps/platform/features/_map/download/downloadActivity.config.ts:L11-L16'
  - symbol: GroupBy
    kind: enum
    at: 'apps/platform/features/_map/download/downloadActivity.config.ts:L18-L25'
  - symbol: TemporalResolution
    kind: enum
    at: 'apps/platform/features/_map/download/downloadActivity.config.ts:L27-L33'
  - symbol: SpatialResolution
    kind: enum
    at: 'apps/platform/features/_map/download/downloadActivity.config.ts:L35-L39'
  - symbol: getBaseGroupByOptions
    kind: function
    at: 'apps/platform/features/_map/download/downloadActivity.config.ts:L85-L104'
  - symbol: getVesselGroupOptions
    kind: function
    at: 'apps/platform/features/_map/download/downloadActivity.config.ts:L105-L111'
  - symbol: getGriddedGroupOptions
    kind: function
    at: 'apps/platform/features/_map/download/downloadActivity.config.ts:L113-L119'
  - symbol: getTemporalResolutionOptions
    kind: function
    at: 'apps/platform/features/_map/download/downloadActivity.config.ts:L139-L156'
  - symbol: Format
    kind: enum
    at: 'apps/platform/features/_map/download/downloadTrack.config.ts:L3-L7'
---

<!-- context:generated:start -->

## Summary

Utility functions (download.utils, downloadTrack.config, downloadActivity.config) validate download eligibility and compute supported options based on datasets, date ranges, and dataview capabilities. getDownloadReportSupported checks time-range limits, getSupportedGroupByOptions disables MMSI/gear-type when dataset metadata lacks support, getSupportedTemporalResolutions filters intervals by date range and fourwings-interval compatibility. Format enums and factory functions (getTemporalResolutionOptions, getGroupByOptions) provide UI choices. A hard-coded blocklist (GEAR_TYPE_UNSUPPORTED_DATASET_IDS) and MAX_AREA_FOR_HIGH_SPATIAL_RESOLUTION threshold enforce business rules.

## Related

- depends on [[download-state-workflow-orchestration]] — downloadActivity.slice reads from downloadActivity.config for enum definitions and validates via download.utils before dispatch.
- implements [[download-ui-form-components]] — Download components call these validation and option-building functions to render filtered choices and disable incompatible combinations.

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
