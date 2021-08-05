import { uniq } from 'lodash'
import {
  Dataview,
  DataviewDatasetConfig,
  DataviewInstance,
  EndpointId,
} from '@globalfishingwatch/api-types'
import { Generators } from '@globalfishingwatch/layer-composer'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { AppDispatch } from 'store'
import { fetchDatasetsByIdsThunk } from 'features/datasets/datasets.slice'
import { fetchDataviewsByIdsThunk } from './dataviews.slice'
import {
  DEFAULT_VESSEL_DATAVIEW_ID,
  dataviewInstances,
  vesselDataviewIds,
  DEFAULT_TRACK_COLOR,
} from './dataviews.config'

// used in workspaces with encounter events layers
export const VESSEL_LAYER_PREFIX = 'vessel-'

type VesselInstanceDatasets = {
  trackDatasetId: string
  infoDatasetId: string
  eventsDatasetsId?: string[]
}
export const getVesselDataviewInstance = (
  vessel: { id: string },
  { trackDatasetId, infoDatasetId, eventsDatasetsId }: VesselInstanceDatasets
): DataviewInstance<Generators.Type> => {
  const datasetsConfig: DataviewDatasetConfig[] = [
    {
      datasetId: trackDatasetId,
      params: [{ id: 'vesselId', value: vessel.id }],
      endpoint: EndpointId.Tracks,
    },
    {
      datasetId: infoDatasetId,
      params: [{ id: 'vesselId', value: vessel.id }],
      endpoint: EndpointId.Vessel,
    },
  ]
  if (eventsDatasetsId) {
    eventsDatasetsId.forEach((eventDatasetId) => {
      datasetsConfig.push({
        datasetId: eventDatasetId,
        query: [{ id: 'vessels', value: vessel.id }],
        params: [],
        endpoint: EndpointId.Events,
      })
    })
  }
  const vesselDataviewInstance = {
    id: `${VESSEL_LAYER_PREFIX}${vessel.id}`,
    dataviewId: DEFAULT_VESSEL_DATAVIEW_ID,
    config: {
      color: DEFAULT_TRACK_COLOR,
      pointsToSegmentsSwitchLevel: null,
    },
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
  }
  const datasets = getDatasetByDataview(dataviews)
  dispatch(fetchDatasetsByIdsThunk(datasets))
}
