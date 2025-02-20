import { createSelector } from '@reduxjs/toolkit'

import { DatasetTypes, DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'

import { REPORT_ONLY_VISIBLE_LAYERS } from 'data/config'
import { BASEMAP_DATAVIEW_SLUG, CLUSTER_PORT_VISIT_EVENTS_DATAVIEW_SLUG } from 'data/workspaces'
import { selectDeprecatedDatasets } from 'features/datasets/datasets.slice'
import { VESSEL_DATAVIEW_INSTANCE_PREFIX } from 'features/dataviews/dataviews.utils'
import {
  getReportCategoryFromDataview,
  getReportSubCategoryFromDataview,
} from 'features/reports/report-area/area-reports.utils'
import {
  getReportVesselGroupVisibleDataviews,
  isVesselGroupActivityDataview,
} from 'features/reports/report-vessel-group/vessel-group-report.dataviews'
import { selectViewOnlyVesselGroup } from 'features/reports/reports.config.selectors'
import { selectReportCategory, selectReportSubCategory } from 'features/reports/reports.selectors'
import { ReportCategory } from 'features/reports/reports.types'
import { selectViewOnlyVessel } from 'features/vessel/vessel.config.selectors'
import { selectIsWorkspaceReady } from 'features/workspace/workspace.selectors'
import {
  selectIsAnyReportLocation,
  selectIsAnyVesselLocation,
  selectIsPortReportLocation,
  selectIsVesselGroupReportLocation,
  selectReportVesselGroupId,
  selectVesselId,
} from 'routes/routes.selectors'
import { createDeepEqualSelector } from 'utils/selectors'

import {
  selectAllDataviewInstancesResolved,
  selectDataviewInstancesMerged,
  selectDataviewInstancesResolved,
} from './dataviews.resolvers.selectors'

export const selectDeprecatedDataviewInstances = createSelector(
  [selectAllDataviewInstancesResolved, selectDeprecatedDatasets],
  (dataviews, deprecatedDatasets = {}) => {
    return dataviews?.filter(({ datasetsConfig, config }) => {
      const hasDatasetsDeprecated =
        datasetsConfig?.some((datasetConfig) => deprecatedDatasets[datasetConfig.datasetId]) ||
        false
      const hasConfigDeprecated = config?.datasets
        ? config.datasets.some((d) => deprecatedDatasets[d])
        : false
      return hasDatasetsDeprecated || hasConfigDeprecated
    })
  }
)

export const selectHasDeprecatedDataviewInstances = createSelector(
  [selectIsWorkspaceReady, selectDeprecatedDataviewInstances],
  (isWorkspaceReady, deprecatedDataviews) => {
    return isWorkspaceReady && deprecatedDataviews && deprecatedDataviews.length > 0
  }
)

export const selectDataviewInstancesResolvedVisible = createSelector(
  [
    selectHasDeprecatedDataviewInstances,
    selectDataviewInstancesResolved,
    selectIsAnyReportLocation,
    selectReportCategory,
    selectReportSubCategory,
    selectIsAnyVesselLocation,
    selectViewOnlyVessel,
    selectVesselId,
    selectIsPortReportLocation,
    selectIsVesselGroupReportLocation,
    selectReportVesselGroupId,
    selectViewOnlyVesselGroup,
  ],
  (
    hasDeprecatedDataviewInstances,
    dataviews = [],
    isAnyReportLocation,
    reportCategory,
    reportSubCategory,
    isVesselLocation,
    viewOnlyVessel,
    vesselId,
    isPortReportLocation,
    isVesselGroupReportLocation,
    reportVesselGroupId,
    viewOnlyVesselGroup
  ) => {
    const visibleDataviews = dataviews.filter((dataview) => dataview.config?.visible)
    if (hasDeprecatedDataviewInstances) {
      return visibleDataviews.filter(
        (d) =>
          d.category === DataviewCategory.Context ||
          d.category === DataviewCategory.User ||
          d.category === DataviewCategory.Environment ||
          d.slug === BASEMAP_DATAVIEW_SLUG
      )
    }
    if (isVesselLocation && viewOnlyVessel && vesselId !== undefined) {
      return visibleDataviews.filter(({ id, config }) => {
        if (REPORT_ONLY_VISIBLE_LAYERS.includes(config?.type as DataviewType)) {
          return true
        }
        return config?.type === DataviewType.Track && id.includes(vesselId)
      })
    }
    if (isAnyReportLocation) {
      let reportDataviews = visibleDataviews
      if (isVesselGroupReportLocation && viewOnlyVesselGroup && reportVesselGroupId !== undefined) {
        reportDataviews = getReportVesselGroupVisibleDataviews({
          dataviews: visibleDataviews,
          reportVesselGroupId,
          vesselGroupReportSection: reportCategory,
          vesselGroupReportSubSection: reportSubCategory,
        })
      }
      return reportDataviews.filter((dataview) => {
        if (
          dataview.category === DataviewCategory.Activity ||
          dataview.category === DataviewCategory.Detections
        ) {
          const matchesCategory = getReportCategoryFromDataview(dataview) === reportCategory
          const matchesSubcategory =
            getReportSubCategoryFromDataview(dataview) === reportSubCategory
          return matchesCategory && matchesSubcategory
        }
        if (dataview.category === DataviewCategory.VesselGroups) {
          // For vessel groups we can't match the category as we inject the category in the dataviews
          if (reportCategory === ReportCategory.Activity) {
            const matchesGroupActivityDataview = isVesselGroupActivityDataview(dataview.id)
            const matchesSubcategory =
              getReportSubCategoryFromDataview(dataview) === reportSubCategory
            return matchesGroupActivityDataview && matchesSubcategory
          }
          return !isVesselGroupActivityDataview(dataview.id)
        }
        if (dataview.category === DataviewCategory.Events) {
          if (isPortReportLocation) {
            return dataview.dataviewId === CLUSTER_PORT_VISIT_EVENTS_DATAVIEW_SLUG
          }
          const matchesSubcategory =
            getReportSubCategoryFromDataview(dataview) === reportSubCategory
          return matchesSubcategory
        }
        if (dataview.category === DataviewCategory.Environment) {
          const matchesCategory = getReportCategoryFromDataview(dataview) === reportCategory
          return matchesCategory
        }
        return true
      })
    }
    return visibleDataviews
  }
)

const selectDataviewInstancesByType = (type: DataviewType) => {
  return createSelector([selectDataviewInstancesResolved], (dataviews) => {
    return dataviews?.filter((dataview) => dataview.config?.type === type)
  })
}

export const selectTrackDataviews = selectDataviewInstancesByType(DataviewType.Track)

export const selectAllActiveTrackDataviews = createSelector([selectTrackDataviews], (dataviews) =>
  dataviews?.filter((d) => d.config?.visible)
)

export const selectUserTrackDataviews = createSelector([selectTrackDataviews], (dataviews) => {
  return dataviews?.filter(
    (dataview) =>
      !dataview.datasets ||
      (dataview.datasets?.[0]?.type === DatasetTypes.UserTracks &&
        dataview.category === DataviewCategory.User)
  )
})

export const selectActiveUserTrackDataviews = createSelector(
  [selectUserTrackDataviews],
  (dataviews) => dataviews?.filter((d) => d.config?.visible)
)

export const selectVesselsDataviews = createSelector([selectTrackDataviews], (dataviews) => {
  return dataviews?.filter(
    (dataview) =>
      !dataview.datasets ||
      (dataview.datasets?.[0]?.type !== DatasetTypes.UserTracks &&
        dataview.category === DataviewCategory.Vessels)
  )
})

export const selectVesselProfileDataview = createDeepEqualSelector(
  [selectVesselsDataviews, selectVesselId],
  (dataviews, vesselId) => dataviews.find(({ id }) => vesselId && id.includes(vesselId))
)

export const selectVesselProfileDataviewIntance = createDeepEqualSelector(
  [selectDataviewInstancesMerged, selectVesselId],
  (dataviewsInstances, vesselId) => {
    return dataviewsInstances?.find(({ id }) => vesselId && id.includes(vesselId))
  }
)

export const selectVesselProfileColor = createSelector(
  [selectVesselProfileDataview],
  (dataview) => dataview?.config?.color
)

export const selectActiveTrackDataviews = createDeepEqualSelector(
  [selectTrackDataviews, selectIsAnyVesselLocation, selectViewOnlyVessel, selectVesselId],
  (dataviews, isVesselLocation, viewOnlyVessel, vesselId) => {
    return dataviews?.filter(({ config, id }) => {
      if (isVesselLocation && viewOnlyVessel) {
        return id === `${VESSEL_DATAVIEW_INSTANCE_PREFIX}${vesselId}` && config?.visible
      }
      return config?.visible
    })
  }
)
