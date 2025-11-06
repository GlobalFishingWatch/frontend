import { createSelector } from '@reduxjs/toolkit'

import type { DataviewType } from '@globalfishingwatch/api-types'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { groupContextDataviews } from '@globalfishingwatch/deck-layer-composer'

import { selectDataviewInstancesResolved } from 'features/dataviews/selectors/dataviews.resolvers.selectors'
import {
  isContextDataviewReportSupported,
  isUserContextDataviewReportSupported,
} from 'features/reports/report-area/area-reports.utils'
import { isVesselGroupActivityDataview } from 'features/reports/report-vessel-group/vessel-group-report.dataviews'
import { selectReportComparisonDataviewIds } from 'features/reports/reports.config.selectors'
import { selectReportVesselGroupId } from 'routes/routes.selectors'

import { dataviewHasVesselGroupId } from '../dataviews.utils'

import { selectDataviewInstancesResolvedVisible } from './dataviews.instances.selectors'

export const selectDataviewInstancesByCategory = (category?: DataviewCategory) => {
  return createSelector(
    [selectDataviewInstancesResolved],
    (dataviews): UrlDataviewInstance<DataviewType>[] => {
      return dataviews?.filter((dataview) => dataview.category === category)
    }
  )
}

export const selectActiveDataviewInstancesByCategory = (category?: DataviewCategory) => {
  return createSelector(
    [selectDataviewInstancesResolvedVisible],
    (dataviews): UrlDataviewInstance<DataviewType>[] => {
      return dataviews?.filter((dataview) => dataview.category === category)
    }
  )
}

export const selectEnvironmentalDataviews = selectDataviewInstancesByCategory(
  DataviewCategory.Environment
)
export const selectActiveEnvironmentalDataviews = selectActiveDataviewInstancesByCategory(
  DataviewCategory.Environment
)

export const selectReportComparisonDataviews = createSelector(
  [selectDataviewInstancesResolved, selectReportComparisonDataviewIds],
  (dataviews, reportComparisonDataviewIds): UrlDataviewInstance<DataviewType>[] => {
    const mainDataview = dataviews?.find(
      (dataview) => reportComparisonDataviewIds?.main === dataview?.id
    )
    const comparedDataview = dataviews?.find(
      (dataview) => reportComparisonDataviewIds?.compare === dataview?.id
    )
    return [mainDataview, comparedDataview].filter((d) => d !== undefined)
  }
)

export const selectEventsDataviews = selectDataviewInstancesByCategory(DataviewCategory.Events)
export const selectActiveEventsDataviews = selectActiveDataviewInstancesByCategory(
  DataviewCategory.Events
)

export const selectActivityDataviews = selectDataviewInstancesByCategory(DataviewCategory.Activity)
export const selectActiveActivityDataviews = selectActiveDataviewInstancesByCategory(
  DataviewCategory.Activity
)

export const selectVesselsDataviews = selectDataviewInstancesByCategory(DataviewCategory.Vessels)
export const selectActiveVesselsDataviews = selectActiveDataviewInstancesByCategory(
  DataviewCategory.Vessels
)

export const selectDetectionsDataviews = selectDataviewInstancesByCategory(
  DataviewCategory.Detections
)
export const selectActiveDetectionsDataviews = selectActiveDataviewInstancesByCategory(
  DataviewCategory.Detections
)

export const selectVesselGroupDataviews = selectDataviewInstancesByCategory(
  DataviewCategory.VesselGroups
)
export const selectActiveVesselGroupDataviews = selectActiveDataviewInstancesByCategory(
  DataviewCategory.VesselGroups
)

export const selectContextAreasDataviews = selectDataviewInstancesByCategory(
  DataviewCategory.Context
)

export const selectContextAreasDataviewsGrouped = createSelector(
  [selectContextAreasDataviews],
  (dataviews) => {
    return groupContextDataviews(dataviews)
  }
)

export const selectActiveContextAreasDataviews = selectDataviewInstancesByCategory(
  DataviewCategory.Context
)

export const selectCustomUserDataviews = selectDataviewInstancesByCategory(DataviewCategory.User)

export const selectCustomUserDataviewsGrouped = createSelector(
  [selectCustomUserDataviews],
  (dataviews) => {
    return groupContextDataviews(dataviews)
  }
)

const selectVGRDataviews = createSelector(
  [selectActiveVesselGroupDataviews, selectReportVesselGroupId],
  (dataviews, reportVesselGroupId) => {
    return dataviews?.filter((dataview) => dataviewHasVesselGroupId(dataview, reportVesselGroupId))
  }
)

export const selectVGRFootprintDataview = createSelector(
  [selectVGRDataviews],
  (vesselGroupDataviews) => {
    return vesselGroupDataviews?.find((dataview) => !isVesselGroupActivityDataview(dataview.id))
  }
)

export const selectVGReportActivityDataviews = createSelector(
  [selectVGRDataviews],
  (vesselGroupDataviews) => {
    return vesselGroupDataviews?.filter((dataview) => isVesselGroupActivityDataview(dataview.id))
  }
)

export const selectOthersActiveReportDataviews = createSelector(
  [selectContextAreasDataviews, selectCustomUserDataviews],
  (contextDataviews = [], userDataviews = []) => {
    const otherDataviews = [...contextDataviews, ...userDataviews]?.filter((dataview) => {
      if (!dataview.config?.visible) {
        return false
      }
      return (
        isUserContextDataviewReportSupported(dataview) || isContextDataviewReportSupported(dataview)
      )
    })
    return otherDataviews
  }
)

export const selectOthersActiveReportDataviewsGrouped = createSelector(
  [selectOthersActiveReportDataviews],
  (otherDataviews = []) => {
    return groupContextDataviews(otherDataviews)
  }
)
