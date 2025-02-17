import { createSelector } from '@reduxjs/toolkit'

import type {
  DataviewDatasetConfig,
  DataviewInstance,
  IdentityVessel,
  Resource,
} from '@globalfishingwatch/api-types'
import { DatasetTypes, DataviewCategory } from '@globalfishingwatch/api-types'
import type {
  GetDatasetConfigsCallbacks,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import {
  extendDataviewDatasetConfig,
  getResources,
  mergeWorkspaceUrlDataviewInstances,
  resolveDataviewDatasetResource,
  resolveDataviews,
  selectResources,
} from '@globalfishingwatch/dataviews-client'
import type { ColorRampId } from '@globalfishingwatch/deck-layers'

import { VESSEL_PROFILE_DATAVIEWS_INSTANCES } from 'data/default-workspaces/context-layers'
import { PORTS_FOOTPRINT_DATAVIEW_SLUG } from 'data/workspaces'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { getRelatedDatasetByType } from 'features/datasets/datasets.utils'
import { selectAllDataviews } from 'features/dataviews/dataviews.slice'
import {
  dataviewHasVesselGroupId,
  getVesselDataviewInstance,
  getVesselDataviewInstanceDatasetConfig,
  VESSEL_DATAVIEW_INSTANCE_PREFIX,
} from 'features/dataviews/dataviews.utils'
import {
  getVesselGroupActivityDataviewInstance,
  getVesselGroupDataviewInstance,
  getVesselGroupEventsDataviewInstances,
} from 'features/reports/report-vessel-group/vessel-group-report.dataviews'
import { selectReportCategorySelector } from 'features/reports/reports.config.selectors'
import type {
  ReportActivitySubCategory,
  ReportEventsSubCategory,
} from 'features/reports/reports.types'
import { selectTrackThinningConfig } from 'features/resources/resources.selectors.thinning'
import { infoDatasetConfigsCallback } from 'features/resources/resources.utils'
import { selectIsGuestUser, selectUserLogged } from 'features/user/selectors/user.selectors'
import { selectVesselInfoData } from 'features/vessel/selectors/vessel.selectors'
import { getRelatedIdentityVesselIds, getVesselProperty } from 'features/vessel/vessel.utils'
import { selectAllVesselGroups } from 'features/vessel-groups/vessel-groups.slice'
import {
  selectWorkspaceDataviewInstances,
  selectWorkspaceStatus,
} from 'features/workspace/workspace.selectors'
import {
  selectIsAnyVesselLocation,
  selectIsPortReportLocation,
  selectIsVesselGroupReportLocation,
  selectIsVesselLocation,
  selectIsWorkspaceLocation,
  selectReportPortId,
  selectReportVesselGroupId,
  selectUrlDataviewInstances,
  selectUrlDataviewInstancesOrder,
  selectVesselId,
} from 'routes/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import { formatInfoField } from 'utils/info'

const EMPTY_ARRAY: [] = []
export const selectWorkspaceDataviewInstancesMerged = createSelector(
  [
    selectIsWorkspaceLocation,
    selectWorkspaceStatus,
    selectWorkspaceDataviewInstances,
    selectUrlDataviewInstances,
  ],
  (
    isWorkspaceLocation,
    workspaceStatus,
    workspaceDataviewInstances,
    urlDataviewInstances = EMPTY_ARRAY
  ): UrlDataviewInstance[] | undefined => {
    if (isWorkspaceLocation && workspaceStatus !== AsyncReducerStatus.Finished) {
      return
    }
    const mergedDataviewInstances =
      mergeWorkspaceUrlDataviewInstances(
        workspaceDataviewInstances as DataviewInstance<any>[],
        urlDataviewInstances
      ) || []

    return mergedDataviewInstances
  }
)

// Inject dataviews on the fly for reports and vessel profile
export const selectDataviewInstancesInjected = createSelector(
  [
    selectWorkspaceDataviewInstancesMerged,
    selectIsAnyVesselLocation,
    selectIsVesselLocation,
    selectIsPortReportLocation,
    selectIsVesselGroupReportLocation,
    selectReportCategorySelector,
    selectReportVesselGroupId,
    selectReportPortId,
    selectVesselId,
    selectVesselInfoData,
  ],
  (
    dataviewInstances,
    isAnyVesselLocation,
    isVesselLocation,
    isPortReportLocation,
    isVesselGroupReportLocation,
    reportCategory,
    reportVesselGroupId,
    reportPortId,
    urlVesselId,
    vessel
  ): UrlDataviewInstance[] | undefined => {
    const dataviewInstancesInjected = [] as UrlDataviewInstance[]
    if (isAnyVesselLocation) {
      const existingDataviewInstance = dataviewInstancesInjected?.find(
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
        dataviewInstancesInjected.push({ ...dataviewInstance, datasetsConfig })
      }
      if (isVesselLocation) {
        VESSEL_PROFILE_DATAVIEWS_INSTANCES.forEach((dataviewInstance) => {
          if (!dataviewInstancesInjected.find(({ id }) => id === dataviewInstance.id)) {
            dataviewInstancesInjected.push({ ...dataviewInstance })
          }
        })
      }
    }
    if (isVesselGroupReportLocation) {
      let vesselGroupDataviewInstance = dataviewInstances?.find((dataview) =>
        dataviewHasVesselGroupId(dataview, reportVesselGroupId)
      )
      if (!vesselGroupDataviewInstance) {
        vesselGroupDataviewInstance = getVesselGroupDataviewInstance(reportVesselGroupId)
        if (vesselGroupDataviewInstance) {
          dataviewInstancesInjected.push(vesselGroupDataviewInstance)
        }
      }
      if (reportCategory === 'activity') {
        const activityReportSubCategories: ReportActivitySubCategory[] = ['fishing', 'presence']
        activityReportSubCategories.forEach((category) => {
          const activitySubcategoryInstance = getVesselGroupActivityDataviewInstance({
            vesselGroupId: reportVesselGroupId,
            color: vesselGroupDataviewInstance?.config?.color,
            colorRamp: vesselGroupDataviewInstance?.config?.colorRamp as ColorRampId,
            activityType: category,
          })
          if (activitySubcategoryInstance) {
            dataviewInstancesInjected.push(activitySubcategoryInstance)
          }
        })
      }
      if (reportCategory === 'events') {
        const eventsReportSubCategories: ReportEventsSubCategory[] = [
          'encounter',
          'loitering',
          'gap',
          'port_visit',
        ]
        eventsReportSubCategories.forEach((category) => {
          dataviewInstancesInjected.push(
            ...getVesselGroupEventsDataviewInstances(reportVesselGroupId, category)
          )
        })
      }
    }
    if (isPortReportLocation) {
      let footprintDataviewInstance = dataviewInstancesInjected?.find(
        (dataview) => dataview.id === PORTS_FOOTPRINT_DATAVIEW_SLUG
      )
      if (footprintDataviewInstance) {
        footprintDataviewInstance.config = {
          ...footprintDataviewInstance.config,
          filters: {
            ...footprintDataviewInstance.config?.filters,
            gfw_id: [reportPortId],
          },
        }
      } else {
        footprintDataviewInstance = {
          id: `${PORTS_FOOTPRINT_DATAVIEW_SLUG}-${Date.now()}`,
          dataviewId: PORTS_FOOTPRINT_DATAVIEW_SLUG,
          config: {
            pickable: false,
            visible: true,
            filters: {
              gfw_id: [reportPortId],
            },
          },
        }
      }
      dataviewInstancesInjected.push(footprintDataviewInstance)
    }
    return dataviewInstancesInjected
  }
)

export const selectDataviewInstancesMerged = createSelector(
  [selectWorkspaceDataviewInstancesMerged, selectDataviewInstancesInjected],
  (
    dataviewInstances = EMPTY_ARRAY,
    injectedDataviewInstances = EMPTY_ARRAY
  ): UrlDataviewInstance[] | undefined => {
    return [...dataviewInstances, ...injectedDataviewInstances]
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
  [selectDataviewsResources, selectResources],
  (dataviewsResources, resources) => {
    if (!dataviewsResources?.dataviews) {
      return defaultDataviewResolved
    }
    const dataviews = dataviewsResources.dataviews.map((dataview) => {
      if (dataview.category !== DataviewCategory.Vessels) {
        return dataview
      }
      const { url } = resolveDataviewDatasetResource(dataview, DatasetTypes.Vessels)
      const infoResource: Resource<IdentityVessel> = resources[url]
      if (!infoResource || !infoResource.data) {
        return dataview
      }
      return {
        ...dataview,
        config: {
          ...dataview.config,
          name: formatInfoField(
            getVesselProperty(infoResource.data as IdentityVessel, 'shipname'),
            'shipname'
          ),
        },
      } as UrlDataviewInstance
    })
    return dataviews
  }
)
