import { uniq } from 'lodash'
import type { AppDispatch } from 'store'

import type {
  Dataview,
  DataviewConfig,
  DataviewDatasetConfig,
  DataviewDatasetConfigParam,
  DataviewInstance} from '@globalfishingwatch/api-types';
import {
  EndpointId,
} from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { GeneratorType } from '@globalfishingwatch/layer-composer'

import { fetchDatasetsByIdsThunk } from 'features/datasets/datasets.slice'

import {
  dataviewInstances,
  DEFAULT_TRACK_COLOR,
  MAP_BACKGROUND_COLOR,
  vesselDataviewIds,
} from './dataviews.config'
import { fetchDataviewsByIdsThunk } from './dataviews.slice'

// used in workspaces with encounter events layers
export const VESSEL_LAYER_PREFIX = 'vessel-'

type VesselInstanceDatasets = {
  trackDatasetId: string
  infoDatasetId?: string
  eventsDatasetsId?: string[]
}
export const getVesselDataviewInstanceId = (vesselId: string) => `${VESSEL_LAYER_PREFIX}${vesselId}`

export const getVesselDataviewInstanceFactory =
  (defaultVesselDataviewId: Dataview['slug'], queryParams: DataviewDatasetConfigParam[]) =>
  (
    vessel: { id: string },
    { trackDatasetId, infoDatasetId, eventsDatasetsId }: VesselInstanceDatasets,
    akaVessels: { id: string }[] = []
  ): DataviewInstance<GeneratorType> => {
    // Build list of unique vessel ids to merge
    // sorted alphabetically so that regardless of the order
    // in which the user selected the vessels
    // the request url is the same
    const akaVesselsIds = Array.from(
      new Set([vessel.id].concat(akaVessels.map((v) => v.id)).sort((a, b) => (a > b ? 1 : -1)))
    ).join(',')
    const datasetsConfig: DataviewDatasetConfig[] = [
      {
        datasetId: trackDatasetId,
        params: [{ id: 'vesselId', value: akaVesselsIds }],
        endpoint: EndpointId.Tracks,
      },
    ]
    if (infoDatasetId) {
      datasetsConfig.push({
        datasetId: infoDatasetId,
        params: [{ id: 'vesselId', value: vessel.id }],
        endpoint: EndpointId.Vessel,
      })
    }
    if (eventsDatasetsId) {
      eventsDatasetsId.forEach((eventDatasetId) => {
        datasetsConfig.push({
          datasetId: eventDatasetId,
          // add query params based on profile view
          query: [{ id: 'vessels', value: akaVesselsIds } as DataviewDatasetConfigParam].concat(
            queryParams
          ),
          params: [],
          endpoint: EndpointId.Events,
        })
      })
    }
    const vesselDataviewInstance: DataviewInstance = {
      id: getVesselDataviewInstanceId(vessel.id),
      dataviewId: defaultVesselDataviewId,
      config: {
        type: GeneratorType.Track,
        color: DEFAULT_TRACK_COLOR,
        pointsToSegmentsSwitchLevel: null,
        event: {
          activeIconsSize: 3,
          activeStrokeColor: MAP_BACKGROUND_COLOR,
          strokeColor: MAP_BACKGROUND_COLOR,
          iconsPrefix: '',
          inactiveIconsSize: 2,
        },
        showIcons: true,
      } as DataviewConfig,
      datasetsConfig,
    }
    return vesselDataviewInstance
  }

export const getDatasetByDataview = (
  dataviews: (Dataview | DataviewInstance | UrlDataviewInstance)[]
) => {
  return uniq(
    dataviews?.flatMap((dataviews) => {
      if (!dataviews.datasetsConfig) return []
      return dataviews.datasetsConfig.map(({ datasetId }) => datasetId)
    })
  )
}

export const initializeDataviews = async (dispatch: AppDispatch) => {
  let dataviews: Dataview[] = []
  const dataviewIds = Array.from(
    new Set([...dataviewInstances.map((instance) => instance.dataviewId), ...vesselDataviewIds])
  )

  const action = await dispatch(fetchDataviewsByIdsThunk(dataviewIds))
  if (fetchDataviewsByIdsThunk.fulfilled.match(action as any)) {
    dataviews = action.payload as Dataview[]
    const datasets = getDatasetByDataview(dataviews)
    dispatch(fetchDatasetsByIdsThunk(datasets))
  }
}
