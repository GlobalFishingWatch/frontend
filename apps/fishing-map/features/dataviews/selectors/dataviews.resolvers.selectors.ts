import { createSelector } from '@reduxjs/toolkit'
import { uniq } from 'es-toolkit'
import {
  DatasetTypes,
  DataviewDatasetConfig,
  DataviewInstance,
} from '@globalfishingwatch/api-types'
import {
  extendDataviewDatasetConfig,
  GetDatasetConfigsCallbacks,
  getResources,
  mergeWorkspaceUrlDataviewInstances,
  resolveDataviews,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import { ColorRampId } from '@globalfishingwatch/deck-layers'
import { VESSEL_PROFILE_DATAVIEWS_INSTANCES } from 'data/default-workspaces/context-layers'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { getRelatedDatasetByType } from 'features/datasets/datasets.utils'
import { selectAllDataviews } from 'features/dataviews/dataviews.slice'
import {
  dataviewHasVesselGroupId,
  getVesselDataviewInstance,
  getVesselDataviewInstanceDatasetConfig,
  VESSEL_DATAVIEW_INSTANCE_PREFIX,
} from 'features/dataviews/dataviews.utils'
import { selectTrackThinningConfig } from 'features/resources/resources.selectors.thinning'
import { infoDatasetConfigsCallback } from 'features/resources/resources.utils'
import { selectIsGuestUser, selectUserLogged } from 'features/user/selectors/user.selectors'
import { selectVesselInfoData } from 'features/vessel/selectors/vessel.selectors'
import { getRelatedIdentityVesselIds } from 'features/vessel/vessel.utils'
import {
  selectWorkspaceDataviewInstances,
  selectWorkspaceStatus,
} from 'features/workspace/workspace.selectors'
import {
  selectIsWorkspaceLocation,
  selectUrlDataviewInstances,
  selectIsAnyVesselLocation,
  selectIsVesselLocation,
  selectVesselId,
  selectUrlDataviewInstancesOrder,
  selectIsVesselGroupReportLocation,
  selectReportVesselGroupId,
} from 'routes/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import { selectAllVesselGroups } from 'features/vessel-groups/vessel-groups.slice'
import {
  getVesselGroupActivityDataviewInstance,
  getVesselGroupDataviewInstance,
  getVesselGroupEventsDataviewInstances,
} from 'features/reports/vessel-groups/vessel-group-report.dataviews'
import { ReportCategory } from 'features/reports/areas/area-reports.types'
import { getReportCategoryFromDataview } from 'features/reports/areas/area-reports.utils'
import { selectVGRActivitySubsection } from 'features/reports/vessel-groups/vessel-group.config.selectors'

const EMPTY_ARRAY: [] = []

export const selectDataviewInstancesMerged = createSelector(
  [
    selectIsWorkspaceLocation,
    selectWorkspaceStatus,
    selectWorkspaceDataviewInstances,
    selectUrlDataviewInstances,
    selectIsAnyVesselLocation,
    selectIsVesselLocation,
    selectIsVesselGroupReportLocation,
    selectVGRActivitySubsection,
    selectReportVesselGroupId,
    selectVesselId,
    selectVesselInfoData,
  ],
  (
    isWorkspaceLocation,
    workspaceStatus,
    workspaceDataviewInstances,
    urlDataviewInstances = EMPTY_ARRAY,
    isAnyVesselLocation,
    isVesselLocation,
    isVesselGroupReportLocation,
    vGRActivitySubsection,
    reportVesselGroupId,
    urlVesselId,
    vessel
  ): UrlDataviewInstance[] | undefined => {
    if (isWorkspaceLocation && workspaceStatus !== AsyncReducerStatus.Finished) {
      return
    }
    const mergedDataviewInstances =
      mergeWorkspaceUrlDataviewInstances(
        workspaceDataviewInstances as DataviewInstance<any>[],
        urlDataviewInstances
      ) || []

    if (isAnyVesselLocation) {
      const existingDataviewInstance = mergedDataviewInstances?.find(
        ({ id }) => urlVesselId && id.includes(urlVesselId)
      )
      if (!existingDataviewInstance && vessel?.identities) {
        const vesselDatasets = {
          info: vessel.info,
          track: vessel.track,
          ...(vessel?.events?.length && {
            events: vessel?.events,
          }),
          relatedVesselIds: getRelatedIdentityVesselIds(vessel),
        }

        const dataviewInstance = getVesselDataviewInstance({ id: urlVesselId }, vesselDatasets)
        const datasetsConfig: DataviewDatasetConfig[] = getVesselDataviewInstanceDatasetConfig(
          urlVesselId,
          vesselDatasets
        )
        mergedDataviewInstances.push({ ...dataviewInstance, datasetsConfig })
      }
      if (isVesselLocation) {
        VESSEL_PROFILE_DATAVIEWS_INSTANCES.forEach((dataviewInstance) => {
          if (!mergedDataviewInstances.find(({ id }) => id === dataviewInstance.id)) {
            mergedDataviewInstances.push({ ...dataviewInstance })
          }
        })
      }
    }
    if (isVesselGroupReportLocation) {
      let vesselGroupDataviewInstance = mergedDataviewInstances?.find((dataview) =>
        dataviewHasVesselGroupId(dataview, reportVesselGroupId)
      )
      if (!vesselGroupDataviewInstance) {
        vesselGroupDataviewInstance = getVesselGroupDataviewInstance(reportVesselGroupId)
        if (vesselGroupDataviewInstance) {
          mergedDataviewInstances.push(vesselGroupDataviewInstance)
        }
      }
      const activityVGRInstance = getVesselGroupActivityDataviewInstance({
        vesselGroupId: reportVesselGroupId,
        color: vesselGroupDataviewInstance?.config?.color,
        colorRamp: vesselGroupDataviewInstance?.config?.colorRamp as ColorRampId,
        activityType: vGRActivitySubsection,
      })
      if (activityVGRInstance) {
        mergedDataviewInstances.push(activityVGRInstance)
      }
      mergedDataviewInstances.push(...getVesselGroupEventsDataviewInstances(reportVesselGroupId))
    }
    return mergedDataviewInstances
  }
)

export const selectDataviewInstancesMergedOrdered = createSelector(
  [selectDataviewInstancesMerged, selectUrlDataviewInstancesOrder],
  (dataviewInstances = [], dataviewInstancesOrder): UrlDataviewInstance[] => {
    if (!dataviewInstancesOrder || !dataviewInstancesOrder.length) {
      return dataviewInstances
    }
    const dataviewInstancesOrdered = dataviewInstances.sort(
      (a, b) => dataviewInstancesOrder.indexOf(a.id) - dataviewInstancesOrder.indexOf(b.id)
    )
    return [...dataviewInstancesOrdered]
  }
)

export const selectAllDataviewInstancesResolved = createSelector(
  [
    selectDataviewInstancesMergedOrdered,
    selectAllDataviews,
    selectAllDatasets,
    selectAllVesselGroups,
    selectUserLogged,
    selectTrackThinningConfig,
    selectIsGuestUser,
  ],
  (
    dataviewInstances,
    dataviews,
    datasets,
    vesselGroups,
    loggedUser,
    trackThinningZoomConfig,
    guestUser
  ): UrlDataviewInstance[] | undefined => {
    if (!dataviews?.length || !datasets?.length || !dataviewInstances?.length) {
      return EMPTY_ARRAY
    }
    const dataviewInstancesWithDatasetConfig = dataviewInstances.map((dataviewInstance) => {
      if (
        dataviewInstance.id?.startsWith(VESSEL_DATAVIEW_INSTANCE_PREFIX) &&
        !dataviewInstance.datasetsConfig?.length &&
        dataviewInstance.config?.info
      ) {
        const vesselId = dataviewInstance.id.split(VESSEL_DATAVIEW_INSTANCE_PREFIX)[1]
        // New way to resolve datasetConfig for vessels to avoid storing all
        // the datasetConfig in the instance and save url string characters
        const config = { ...dataviewInstance.config }
        // Vessel pined from not logged user but is logged now and the related dataset is available
        if (loggedUser && !config.track) {
          const dataset = datasets.find((d) => d.id === config.info)
          const trackDatasetId = getRelatedDatasetByType(dataset, DatasetTypes.Tracks)?.id
          if (trackDatasetId) {
            config.track = trackDatasetId
          }
        }
        const datasetsConfig: DataviewDatasetConfig[] = getVesselDataviewInstanceDatasetConfig(
          vesselId,
          config
        )
        return {
          ...dataviewInstance,
          config: {
            ...dataviewInstance.config,
            trackThinningZoomConfig,
          },
          datasetsConfig,
        }
      }
      return dataviewInstance
    })
    const dataviewInstancesResolved = resolveDataviews(
      dataviewInstancesWithDatasetConfig,
      dataviews,
      datasets,
      vesselGroups
    )
    const callbacks: GetDatasetConfigsCallbacks = {
      info: infoDatasetConfigsCallback(guestUser),
    }
    const dataviewInstancesResolvedExtended = extendDataviewDatasetConfig(
      dataviewInstancesResolved,
      callbacks
    )
    return dataviewInstancesResolvedExtended
  }
)

/**
 * Calls getResources to prepare track dataviews' datasetConfigs.
 * Injects app-specific logic by using getResources's callback
 */
export const selectDataviewsResources = createSelector(
  [selectAllDataviewInstancesResolved],
  (dataviewInstances) => {
    return getResources(dataviewInstances || [])
  }
)

const defaultDataviewResolved: UrlDataviewInstance[] = []
export const selectDataviewInstancesResolved = createSelector(
  [selectDataviewsResources],
  (dataviewsResources) => {
    return dataviewsResources.dataviews || defaultDataviewResolved
  }
)

export const selectActiveDataviewsCategories = createSelector(
  [selectDataviewInstancesResolved],
  (dataviews): ReportCategory[] => {
    return uniq(dataviews.flatMap((d) => getReportCategoryFromDataview(d) || []))
  }
)
