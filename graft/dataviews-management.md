---
name: Dataviews Management
slug: dataviews-management
type: system
sources:
  - path: apps/platform/features/_map/dataviews/dataviews.hooks.ts
    hash: f6517cd449bf4a48d75421a7b998844a42724199aaab7c14016dcc2b4a266bbd
  - path: apps/platform/features/_map/dataviews/dataviews.mock.ts
    hash: 2de2f0ddff2b8a2bcaf8d24fc719ede7856403b2a2619cc9d10fe3bf9ef322b6
  - path: apps/platform/features/_map/dataviews/dataviews.slice.ts
    hash: 3ce12eff9e186ff0e1c8741b79764b67cd0a38eef0ca2e5ad0d4e46152059de0
  - path: apps/platform/features/_map/dataviews/dataviews.utils.spec.ts
    hash: f90c7703cc320237af784d9f672db48c2cf844c26f9e03d5ee35242f9e2c637d
  - path: apps/platform/features/_map/dataviews/dataviews.utils.ts
    hash: 1acbece36e7e4d41d78302c72bdc83ac385c7a9dc737cbf28d856201dae18c19
  - path: >-
      apps/platform/features/_map/dataviews/selectors/dataviews.categories.selectors.ts
    hash: d5b6c8b1372e996df9db04f4c61d0a03f12d71ce6402159ca5792728446efc99
sources_digest: b7910358e7904b5b9ae2c5129fb4e60eefdf738ef6d44d606c9dd7d174a4383b
links:
  - to: dataset-management-redux-layer
    relation: depends_on
    description: >-
      Dataview factories fetch datasets from dataset selectors to instantiate
      layer configs; migration utilities resolve deprecated datasets
  - to: dataviews-filter-configuration
    relation: uses
    description: >-
      Dataview instances reference filter configs which are assembled via
      dataviews.filters module
generator:
  version: 1
covers:
  - symbol: normalizeDataviewFilters
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.hooks.ts:L32-L41'
  - symbol: areDataviewFiltersEqual
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.hooks.ts:L43-L46'
  - symbol: areDataviewSourcesEqual
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.hooks.ts:L48-L49'
  - symbol: getSupportedFilters
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.hooks.ts:L51-L68'
  - symbol: useMigrateToLatestDataview
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.hooks.ts:L75-L239'
  - symbol: normalizeDataview
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.slice.ts:L52-L55'
  - symbol: DataviewsState
    kind: type
    at: 'apps/platform/features/_map/dataviews/dataviews.slice.ts:L142-L142'
  - symbol: DataviewsSliceState
    kind: type
    at: 'apps/platform/features/_map/dataviews/dataviews.slice.ts:L143-L143'
  - symbol: selectDataviewBySlug
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.slice.ts:L168-L172'
  - symbol: getInstance
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.spec.ts:L36-L42'
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
  - symbol: selectDataviewInstancesByCategory
    kind: function
    at: >-
      apps/platform/features/_map/dataviews/selectors/dataviews.categories.selectors.ts:L26-L33
  - symbol: selectActiveDataviewInstancesByCategory
    kind: function
    at: >-
      apps/platform/features/_map/dataviews/selectors/dataviews.categories.selectors.ts:L35-L45
---

<!-- context:generated:start -->

## Summary

Redux state management and utilities for dataview instances—concrete map layer configurations that visualize datasets (vessels, activity, context, user-uploaded geoms). Provides async thunks to fetch/update dataviews, factories to construct instances from templates/datasets, migration utilities for deprecated views, and selectors that categorize instances by type and visibility.

## Related

- depends on [[dataset-management-redux-layer]] — Dataview factories fetch datasets from dataset selectors to instantiate layer configs; migration utilities resolve deprecated datasets
- uses [[dataviews-filter-configuration]] — Dataview instances reference filter configs which are assembled via dataviews.filters module

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
