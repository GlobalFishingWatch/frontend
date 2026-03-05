import { createSelector } from '@reduxjs/toolkit'

import type { DataviewInstance } from '@globalfishingwatch/api-types'
import { DatasetTypes, DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import { REPORT_ONLY_VISIBLE_LAYERS } from 'data/config'
import { CLUSTER_PORT_VISIT_EVENTS_DATAVIEW_SLUG } from 'data/workspaces'
import { DATASET_VERSION_SEPARATOR } from 'data/workspaces.config'
import {
  getIsEncounteredVesselDataviewInstanceId,
  getIsVesselDataviewInstanceId,
  getVesselDataviewInstanceId,
} from 'features/dataviews/dataviews.utils'
import { getDatasetSourceTranslated } from 'features/i18n/utils.datasets'
import {
  getReportCategoryFromDataview,
  getReportSubCategoryFromDataview,
} from 'features/reports/report-area/area-reports.utils'
import {
  getReportVesselGroupVisibleDataviews,
  isVesselGroupActivityDataview,
} from 'features/reports/report-vessel-group/vessel-group-report.dataviews'
import { selectReportComparisonDataviewIds } from 'features/reports/reports.config.selectors'
import { selectReportCategory, selectReportSubCategory } from 'features/reports/reports.selectors'
import { ReportCategory } from 'features/reports/reports.types'
import { selectCurrentVesselEvent } from 'features/vessel/selectors/vessel.selectors'
import { selectVesselDatasetId } from 'features/vessel/vessel.config.selectors'
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

export const findVesselProfileDataviewInstance = (
  dataviewInstances: (DataviewInstance | UrlDataviewInstance)[],
  vesselId: string,
  vesselDatasetId: string
) => {
  if (dataviewInstances?.length && vesselId) {
    const vesselProfileDataviewInstances = (dataviewInstances || [])?.filter(
      ({ id }) => vesselId && id && id.includes(vesselId)
    )
    if (vesselProfileDataviewInstances.length === 1) {
      return vesselProfileDataviewInstances[0]
    }
    const vesselDatasetIdVersion = vesselDatasetId.split(DATASET_VERSION_SEPARATOR)[1] as string
    const exactProfileDataviewInstanceMatch = vesselProfileDataviewInstances?.find(({ id }) => {
      return id === getVesselDataviewInstanceId(vesselId, vesselDatasetIdVersion)
    })
    if (exactProfileDataviewInstanceMatch) {
      return exactProfileDataviewInstanceMatch
    }
    // Returns the first vessel profile dataview instance that does not include the dataset version
    return vesselProfileDataviewInstances.find(({ id }) => !id.includes(DATASET_VERSION_SEPARATOR))
  }
}

export const selectDataviewInstancesResolvedVisible = createSelector(
  [
    selectReportComparisonDataviewIds,
    selectDataviewInstancesResolved,
    selectIsAnyReportLocation,
    selectReportCategory,
    selectReportSubCategory,
    selectIsAnyVesselLocation,
    selectVesselId,
    selectVesselDatasetId,
    selectCurrentVesselEvent,
    selectIsPortReportLocation,
    selectIsVesselGroupReportLocation,
    selectReportVesselGroupId,
  ],
  (
    reportComparisonDataviewIds,
    dataviews = [],
    isAnyReportLocation,
    reportCategory,
    reportSubCategory,
    isVesselLocation,
    vesselId,
    vesselDatasetId,
    currentVesselEvent,
    isPortReportLocation,
    isVesselGroupReportLocation,
    reportVesselGroupId
  ) => {
    const visibleDataviews = dataviews.filter((dataview) => dataview.config?.visible)
    if (isVesselLocation && vesselId !== undefined) {
      const filteredDataviews = visibleDataviews.filter(({ id, config, origin }) => {
        if (REPORT_ONLY_VISIBLE_LAYERS.includes(config?.type as DataviewType)) {
          return true
        }
        const vesselProfileDataviewInstance = findVesselProfileDataviewInstance(
          dataviews,
          vesselId,
          vesselDatasetId
        )
        const isSameVessel = id === vesselProfileDataviewInstance?.id
        const isVesselProfileOrigin = origin === 'vesselProfile'
        const isEncounterVesselTrack =
          id.includes(currentVesselEvent?.encounter?.vessel?.id || '') &&
          getIsEncounteredVesselDataviewInstanceId(id)
        return (
          config?.type === DataviewType.Track &&
          (isSameVessel || isVesselProfileOrigin || isEncounterVesselTrack)
        )
      })
      return filteredDataviews
    }
    if (isAnyReportLocation) {
      let reportDataviews = visibleDataviews
      if (isVesselGroupReportLocation && reportVesselGroupId !== undefined) {
        reportDataviews = getReportVesselGroupVisibleDataviews({
          dataviews: visibleDataviews,
          reportVesselGroupId,
          vesselGroupReportSection: reportCategory,
          vesselGroupReportSubSection: reportSubCategory,
        })
      }
      return reportDataviews.filter((dataview) => {
        if (reportComparisonDataviewIds?.compare === dataview.id) return true
        if (
          dataview.category === DataviewCategory.Activity ||
          dataview.category === DataviewCategory.Detections
        ) {
          if (isVesselGroupReportLocation) return false
          const matchesCategory = getReportCategoryFromDataview(dataview) === reportCategory
          const matchesSubcategory =
            getReportSubCategoryFromDataview(dataview) === reportSubCategory
          return matchesCategory && matchesSubcategory
        }
        if (dataview.category === DataviewCategory.VesselGroups) {
          // For vessel groups we can't match the category as we inject the category in the dataviews
          const matchesGroupActivityDataview = isVesselGroupActivityDataview(dataview.id)
          if (reportCategory === ReportCategory.Activity) {
            const matchesSubcategory =
              getReportSubCategoryFromDataview(dataview) === reportSubCategory
            return matchesGroupActivityDataview && matchesSubcategory
          } else if (
            reportCategory === ReportCategory.VesselGroup ||
            reportCategory === ReportCategory.VesselGroupInsights
          ) {
            return !matchesGroupActivityDataview
          }
          return false
        }
        if (dataview.category === DataviewCategory.Events) {
          if (isPortReportLocation) {
            return dataview.dataviewId === CLUSTER_PORT_VISIT_EVENTS_DATAVIEW_SLUG
          }
          const matchesSubcategory =
            getReportSubCategoryFromDataview(dataview) === reportSubCategory
          if (isVesselGroupReportLocation) {
            return matchesSubcategory && getIsVesselDataviewInstanceId(dataview.id)
          }
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

export const selectHasDeprecatedDataviewInstances = createSelector(
  [selectDataviewInstancesResolvedVisible],
  (dataviews) => {
    return dataviews?.some((dataview) => dataview.deprecated)
  }
)

const selectDataviewInstancesByType = (type: DataviewType) => {
  return createSelector([selectDataviewInstancesResolved], (dataviews) => {
    return dataviews?.filter((dataview) => dataview.config?.type === type)
  })
}

export const selectTrackDataviews = selectDataviewInstancesByType(DataviewType.Track)
export const selectTimebarTrackDataviews = createSelector([selectTrackDataviews], (dataviews) => {
  return dataviews?.filter(
    (d) => d.config?.visible && !getIsEncounteredVesselDataviewInstanceId(d.id)
  )
})

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
  [selectVesselsDataviews, selectVesselId, selectVesselDatasetId],
  (dataviews, vesselId, vesselDatasetId) =>
    findVesselProfileDataviewInstance(dataviews, vesselId, vesselDatasetId)
)

export const selectVesselProfileSource = createDeepEqualSelector(
  [selectVesselProfileDataview],
  (vesselProfileDataview) => {
    return getDatasetSourceTranslated(vesselProfileDataview?.datasets)
  }
)

export const selectVesselProfileDataviewIntance = createDeepEqualSelector(
  [selectDataviewInstancesMerged, selectVesselId, selectVesselDatasetId],
  (dataviewsInstances = [], vesselId, vesselDatasetId) => {
    return findVesselProfileDataviewInstance(dataviewsInstances, vesselId, vesselDatasetId)
  }
)

export const selectVesselProfileDataviewIntanceResolved = createDeepEqualSelector(
  [selectAllDataviewInstancesResolved, selectVesselId, selectVesselDatasetId],
  (dataviewsInstances = [], vesselId, vesselDatasetId) => {
    return findVesselProfileDataviewInstance(dataviewsInstances, vesselId, vesselDatasetId)
  }
)

export const selectVesselProfileColor = createSelector(
  [selectVesselProfileDataview],
  (dataview) => dataview?.config?.color
)

export const selectActiveTrackDataviews = createDeepEqualSelector(
  [selectTrackDataviews, selectIsAnyVesselLocation, selectVesselId],
  (dataviews, isAnyVesselLocation, vesselId) => {
    return dataviews?.filter(({ config, id, origin }) => {
      if (isAnyVesselLocation) {
        return (
          (id === getVesselDataviewInstanceId(vesselId) || origin === 'vesselProfile') &&
          config?.visible
        )
      }
      return config?.visible
    })
  }
)

export const selectVectorDataviews = selectDataviewInstancesByType(DataviewType.FourwingsVector)
export const selectActiveVectorDataviews = createDeepEqualSelector(
  [selectVectorDataviews],
  (dataviews) => {
    return dataviews?.filter((dv) => dv.config?.visible)
  }
)

export const selectHasVectorDataviews = createSelector(
  [selectActiveVectorDataviews],
  (vectorDataviews) => {
    return vectorDataviews?.length > 0
  }
)
