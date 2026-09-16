---
name: Real-Time Support Categorization
slug: real-time-support-categorization
type: concept
sources:
  - path: apps/platform/features/_map/dataviews/dataviews.utils.ts
    hash: 1acbece36e7e4d41d78302c72bdc83ac385c7a9dc737cbf28d856201dae18c19
sources_digest: 1a03aebe53de7c5b3804019244513f9b6a9d867e054c8576cd59855669118440
links: []
generator:
  version: 1
covers:
  - symbol: dataviewHasVesselGroupId
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L88-L90'
  - symbol: getContextDataviewDataset
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L93-L100'
  - symbol: dataviewHasUserTimeRange
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L102-L110'
  - symbol: GetVesselInWorkspaceParams
    kind: type
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L112-L116'
  - symbol: getVesselDataview
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L118-L136'
  - symbol: getHasVesselProfileInstance
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L138-L148'
  - symbol: getVesselInfoDataviewInstanceDatasetConfig
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L150-L170'
  - symbol: getVesselDataviewInstanceDatasetConfig
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L172-L208'
  - symbol: resolveVesselTrackConfig
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L212-L236'
  - symbol: resolveVesselDataviewInstance
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L238-L268'
  - symbol: withLonglineSetsEvents
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L272-L310'
  - symbol: isFishingEventsConfig
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L276-L278'
  - symbol: VesselDataviewInstanceTemplateParams
    kind: type
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L312-L320'
  - symbol: vesselDataviewInstanceTemplate
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L322-L352'
  - symbol: getBestVesselTemplateSlug
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L355-L370'
  - symbol: findTemplate
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L361-L364'
  - symbol: getVesselDataviewInstance
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L372-L411'
  - symbol: getVesselEncounterTrackDataviewInstance
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L413-L456'
  - symbol: getUserPolygonsDataviewInstance
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L458-L475'
  - symbol: getUserPointsDataviewInstance
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L477-L513'
  - symbol: getUserFourwingsDataviewInstance
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L515-L541'
  - symbol: getUserTrackDataviewInstance
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L543-L560'
  - symbol: getContextDataviewInstance
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L562-L579'
  - symbol: getDataviewInstanceFromDataview
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L581-L586'
  - symbol: getBigQuery4WingsDataviewInstance
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L588-L615'
  - symbol: getBigQueryEventsDataviewInstance
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L617-L634'
  - symbol: dataviewWithPrivateDatasets
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L636-L639'
  - symbol: isBathymetryDataview
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L641-L646'
  - symbol: isBathymetryContourDataview
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L648-L650'
  - symbol: getIsPositionSupportedInDataview
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L652-L664'
  - symbol: hasVesselGroupDatasetsDeprecated
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L666-L674'
  - symbol: hasVesselGroupDatasetsDeleted
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L676-L684'
  - symbol: isDataviewDeprecated
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L686-L724'
  - symbol: isRealTimeActivityDataview
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L733-L738'
  - symbol: isRealTimeDataview
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L740-L745'
  - symbol: isHistoricalDataview
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L747-L752'
  - symbol: hasWorkspaceDataviewsDeprecated
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L754-L766'
---

<!-- context:generated:start -->

## Summary

Real-time dataset support is category-dependent: Activity dataviews must explicitly opt in via real-time dataset slugs or configuration flags, while Basemap and Context categories are real-time by default. Dataview factory functions detect deprecation via both static legacy mappings and dynamic API dataset migration metadata.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
