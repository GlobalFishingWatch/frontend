---
name: SQL Filter Computation
slug: sql-filter-computation
type: concept
sources:
  - path: libs/dataviews-client/src/resolve-dataviews.ts
    hash: 6ec3d70d96f697cfded7f75d7e59f913da5530a34130dfe543eaea5c0a2e7d02
sources_digest: d3fe4f6987b48977d6a88a5675bf37c5e42aaed85f762ce10369983720ddbfae
links:
  - to: deck-layer-resource-fetching
    relation: produces
    description: SQL filters parameterize tile and resource requests sent to the API
generator:
  version: 1
covers:
  - symbol: isActivityDataview
    kind: function
    at: 'libs/dataviews-client/src/resolve-dataviews.ts:L33-L38'
  - symbol: isDetectionsDataview
    kind: function
    at: 'libs/dataviews-client/src/resolve-dataviews.ts:L40-L45'
  - symbol: isComparisonDataview
    kind: function
    at: 'libs/dataviews-client/src/resolve-dataviews.ts:L47-L49'
  - symbol: isVesselGroupDataview
    kind: function
    at: 'libs/dataviews-client/src/resolve-dataviews.ts:L51-L56'
  - symbol: isTrackDataview
    kind: function
    at: 'libs/dataviews-client/src/resolve-dataviews.ts:L58-L62'
  - symbol: isUserHeatmapDataview
    kind: function
    at: 'libs/dataviews-client/src/resolve-dataviews.ts:L64-L69'
  - symbol: isContextDataview
    kind: function
    at: 'libs/dataviews-client/src/resolve-dataviews.ts:L71-L73'
  - symbol: isUserTrackDataview
    kind: function
    at: 'libs/dataviews-client/src/resolve-dataviews.ts:L75-L77'
  - symbol: isUserPolygonsDataview
    kind: function
    at: 'libs/dataviews-client/src/resolve-dataviews.ts:L79-L81'
  - symbol: isUserPointsDataview
    kind: function
    at: 'libs/dataviews-client/src/resolve-dataviews.ts:L83-L85'
  - symbol: isAnyContextDataview
    kind: function
    at: 'libs/dataviews-client/src/resolve-dataviews.ts:L87-L94'
  - symbol: isHeatmapStaticDataview
    kind: function
    at: 'libs/dataviews-client/src/resolve-dataviews.ts:L96-L98'
  - symbol: isHeatmapVectorsDataview
    kind: function
    at: 'libs/dataviews-client/src/resolve-dataviews.ts:L100-L102'
  - symbol: isEnvironmentalDataview
    kind: function
    at: 'libs/dataviews-client/src/resolve-dataviews.ts:L104-L109'
  - symbol: getIsSingleHeatmapDataview
    kind: function
    at: 'libs/dataviews-client/src/resolve-dataviews.ts:L111-L120'
  - symbol: getMergedDataviewId
    kind: function
    at: 'libs/dataviews-client/src/resolve-dataviews.ts:L122-L128'
  - symbol: getDatasetSchemaItem
    kind: function
    at: 'libs/dataviews-client/src/resolve-dataviews.ts:L143-L146'
  - symbol: isFilterableDataviewInstanceGenerator
    kind: function
    at: 'libs/dataviews-client/src/resolve-dataviews.ts:L148-L150'
  - symbol: mergeWorkspaceUrlDataviewInstances
    kind: function
    at: 'libs/dataviews-client/src/resolve-dataviews.ts:L158-L201'
  - symbol: GetDatasetConfigsParams
    kind: type
    at: 'libs/dataviews-client/src/resolve-dataviews.ts:L203-L206'
  - symbol: getDatasetConfigsByDatasetType
    kind: function
    at: 'libs/dataviews-client/src/resolve-dataviews.ts:L207-L235'
  - symbol: getDatasetConfigByDatasetType
    kind: function
    at: 'libs/dataviews-client/src/resolve-dataviews.ts:L237-L242'
  - symbol: getTrackDataviewDatasetConfigs
    kind: function
    at: 'libs/dataviews-client/src/resolve-dataviews.ts:L247-L263'
  - symbol: DatasetConfigsTransforms
    kind: type
    at: 'libs/dataviews-client/src/resolve-dataviews.ts:L265-L267'
  - symbol: getDataviewsForResourceQuerying
    kind: function
    at: 'libs/dataviews-client/src/resolve-dataviews.ts:L277-L301'
  - symbol: resolveResourcesFromDatasetConfigs
    kind: function
    at: 'libs/dataviews-client/src/resolve-dataviews.ts:L307-L324'
  - symbol: generateDataviewDatasetResourceKey
    kind: function
    at: 'libs/dataviews-client/src/resolve-dataviews.ts:L326-L335'
  - symbol: resolveDataviewDatasetResources
    kind: function
    at: 'libs/dataviews-client/src/resolve-dataviews.ts:L340-L381'
  - symbol: resolveDataviewDatasetResource
    kind: function
    at: 'libs/dataviews-client/src/resolve-dataviews.ts:L383-L388'
  - symbol: getOperationLabel
    kind: function
    at: 'libs/dataviews-client/src/resolve-dataviews.ts:L390-L393'
  - symbol: getOperationOperator
    kind: function
    at: 'libs/dataviews-client/src/resolve-dataviews.ts:L395-L397'
  - symbol: getDataviewFilters
    kind: function
    at: 'libs/dataviews-client/src/resolve-dataviews.ts:L399-L409'
  - symbol: getDataviewSqlFiltersResolved
    kind: function
    at: 'libs/dataviews-client/src/resolve-dataviews.ts:L411-L474'
  - symbol: getDataviewVesselGroupId
    kind: function
    at: 'libs/dataviews-client/src/resolve-dataviews.ts:L476-L478'
  - symbol: getDataviewVesselGroup
    kind: function
    at: 'libs/dataviews-client/src/resolve-dataviews.ts:L480-L488'
  - symbol: resolveDataviews
    kind: function
    at: 'libs/dataviews-client/src/resolve-dataviews.ts:L496-L648'
---

<!-- context:generated:start -->

## Summary

Transforms user-defined filter selections (range, string, numeric) into SQL WHERE clauses with field type awareness and null-value workarounds. Restricts filter generation to specific visualization types and handles vessel-group filters separately.

## Related

- produces [[deck-layer-resource-fetching]] — SQL filters parameterize tile and resource requests sent to the API

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
