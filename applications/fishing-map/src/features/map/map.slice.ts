import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { uniqBy } from 'lodash'
import { InteractionEvent, ExtendedFeature } from '@globalfishingwatch/react-hooks'
import GFWAPI from '@globalfishingwatch/api-client'
import { resolveEndpoint } from '@globalfishingwatch/dataviews-client'
import {
  DataviewDatasetConfig,
  Dataset,
  Vessel,
  DatasetTypes,
  EventVessel,
  ApiEvent,
  AuthorizationOptions,
  EventTypes,
  EndpointId,
} from '@globalfishingwatch/api-types'
import { AsyncReducerStatus } from 'utils/async-slice'
import { AppDispatch, RootState } from 'store'
import { getRelatedDatasetByType } from 'features/datasets/datasets.selectors'
import {
  selectEventsDataviews,
  selectActivityDataviews,
} from 'features/dataviews/dataviews.selectors'
import { fetchDatasetByIdThunk, selectDatasetById } from 'features/datasets/datasets.slice'
import { Range } from 'features/timebar/timebar.slice'

export const MAX_TOOLTIP_VESSELS = 5

export type ExtendedFeatureVessel = {
  id: string
  hours: number
  dataset: Dataset
  [key: string]: any
}

// TODO remove this once the cluster events follow the same API events format
type TemporalClusterBusterEvent = {
  event_id: string
  event_type: EventTypes
  vessel_id: string
  event_start: string
  event_end: string
  event_info: {
    regions: {
      eez: string[]
      fao: string[]
      rfmo: string[]
    }
    elevation_m: number
    is_authorized: boolean
    median_distance_km: number
    median_speed_knots: number
    authorization_status: AuthorizationOptions
    distance_from_port_m: number
    distance_from_shore_m: number
    encountered_vessel_id: string
  }
  event_vessels: EventVessel[]
}

export type ExtendedFeatureEvent = ApiEvent & { dataset: Dataset }

export type SliceExtendedFeature = ExtendedFeature & {
  event?: ExtendedFeatureEvent
  vessels?: ExtendedFeatureVessel[]
}

// Extends the default extendedEvent including event and vessels information from API
export type SliceInteractionEvent = Omit<InteractionEvent, 'features'> & {
  features: SliceExtendedFeature[]
}

type MapState = {
  clicked: SliceInteractionEvent | null
  hovered: SliceInteractionEvent | null
  fourWingsStatus: AsyncReducerStatus
  apiEventStatus: AsyncReducerStatus
}

const initialState: MapState = {
  clicked: null,
  hovered: null,
  fourWingsStatus: AsyncReducerStatus.Idle,
  apiEventStatus: AsyncReducerStatus.Idle,
}

type SublayerVessels = {
  sublayerId: string
  vessels: ExtendedFeatureVessel[]
}

export const fetch4WingInteractionThunk = createAsyncThunk<
  { vessels: SublayerVessels[] } | undefined,
  { temporalGridFeatures: ExtendedFeature[]; timeRange: Range },
  {
    dispatch: AppDispatch
  }
>(
  'map/fetchInteraction',
  async ({ temporalGridFeatures, timeRange }, { getState, signal, dispatch }) => {
    const state = getState() as RootState
    const temporalgridDataviews = selectActivityDataviews(state) || []
    const { start, end } = timeRange || {}

    // get corresponding dataviews
    const featuresDataviews = temporalGridFeatures.flatMap((feature) => {
      return feature.temporalgrid
        ? temporalgridDataviews.find(
            (dataview) => dataview.id === feature?.temporalgrid?.sublayerId
          ) || []
        : []
    })
    const fourWingsDataset = featuresDataviews[0].datasets?.find(
      (d) => d.type === DatasetTypes.Fourwings
    ) as Dataset

    // get corresponding datasets
    const datasets: string[][] = featuresDataviews.map((dv) => {
      return dv.config?.datasets || []
    })

    // use the first feature/dv for common parameters
    const mainFeature = temporalGridFeatures[0]
    const datasetConfig: DataviewDatasetConfig = {
      datasetId: fourWingsDataset.id,
      endpoint: EndpointId.FourwingsInteraction,
      params: [
        { id: 'z', value: mainFeature.tile?.z },
        { id: 'x', value: mainFeature.tile?.x },
        { id: 'y', value: mainFeature.tile?.y },
        { id: 'rows', value: mainFeature.temporalgrid?.row as number },
        { id: 'cols', value: mainFeature.temporalgrid?.col as number },
      ],
      query: [
        { id: 'date-range', value: [start, end].join(',') },
        {
          id: 'datasets',
          value: datasets.map((ds) => ds.join(',')),
        },
      ],
    }

    const filters = featuresDataviews.map((dv) => dv.config?.filter || [])
    if (filters?.length) {
      datasetConfig.query?.push({ id: 'filters', value: filters })
    }

    const interactionUrl = resolveEndpoint(fourWingsDataset, datasetConfig)
    if (interactionUrl) {
      const sublayersVesselsIds = await GFWAPI.fetch<ExtendedFeatureVessel[]>(interactionUrl, {
        signal,
      })

      let startingIndex = 0
      const vesselsBySource: ExtendedFeatureVessel[][][] = featuresDataviews.map((dataview) => {
        const datasets: string[] = dataview.config?.datasets
        const newStartingIndex = startingIndex + datasets.length
        const dataviewVesselsIds = sublayersVesselsIds.slice(startingIndex, newStartingIndex)
        startingIndex = newStartingIndex
        return dataviewVesselsIds.map((vessels, i) => {
          const dataset = selectDatasetById(datasets[i])(state)
          return vessels.flatMap((vessel: ExtendedFeatureVessel) => ({ ...vessel, dataset }))
        })
      })

      const topHoursVessels = vesselsBySource
        .map((source) => {
          return source
            .flatMap((source) => source)
            .sort((a, b) => b.hours - a.hours)
            .slice(0, MAX_TOOLTIP_VESSELS)
        })
        .flatMap((v) => v)

      const topHoursVesselsDatasets = uniqBy(
        topHoursVessels.map(({ dataset }) => dataset),
        'id'
      )

      // Grab related dataset to fetch info from and prepare tracks
      const infoDatasets = await Promise.all(
        topHoursVesselsDatasets.map(async (dataset) => {
          const infoDatasetId = getRelatedDatasetByType(dataset, DatasetTypes.Vessels)?.id
          if (infoDatasetId) {
            let infoDataset = selectDatasetById(infoDatasetId)(state)
            if (!infoDataset) {
              // It needs to be request when it hasn't been loaded yet
              const action = await dispatch(fetchDatasetByIdThunk(infoDatasetId))
              if (fetchDatasetByIdThunk.fulfilled.match(action)) {
                infoDataset = action.payload
              }
            }
            return infoDataset
          }
        })
      )

      let vesselsInfo: Vessel[] = []
      if (infoDatasets?.length) {
        const infoDataset = infoDatasets[0]
        if (infoDataset) {
          const infoDatasetConfig = {
            endpoint: EndpointId.VesselList,
            datasetId: infoDataset.id,
            params: [],
            query: [
              {
                id: 'datasets',
                value: infoDatasets.flatMap((infoDataset) => infoDataset?.id || []),
              },
              {
                id: 'ids',
                value: topHoursVessels.map((v) => v.id),
              },
            ],
          }
          const vesselsInfoUrl = resolveEndpoint(infoDataset, infoDatasetConfig)

          if (vesselsInfoUrl) {
            try {
              const vesselsInfoResponse = await GFWAPI.fetch<Vessel[]>(vesselsInfoUrl, {
                signal,
              })
              // TODO remove entries once the API is stable
              const vesselsInfoList: Vessel[] =
                !vesselsInfoResponse.entries || typeof vesselsInfoResponse.entries === 'function'
                  ? vesselsInfoResponse
                  : (vesselsInfoResponse as any)?.entries
              vesselsInfo = vesselsInfoList || []
            } catch (e) {
              console.warn(e)
            }
          }
        }
      }

      const sublayersIds = temporalGridFeatures.map(
        (feature) => feature.temporalgrid?.sublayerId || ''
      )
      const sublayersVessels: SublayerVessels[] = vesselsBySource.map((sublayerVessels, i) => {
        return {
          sublayerId: sublayersIds[i],
          vessels: sublayerVessels
            .flatMap((vessels) => {
              return vessels.map((vessel) => {
                const vesselInfo = vesselsInfo?.find((entry) => entry.id === vessel.id)
                if (!vesselInfo) return vessel
                return { ...vesselInfo, ...vessel }
              })
            })
            .sort((a, b) => b.hours - a.hours),
        }
      })

      return { vessels: sublayersVessels }
    }
  }
)

// TODO: remove this workaound once the api returns the same format for every event
const parseClusterEvent = (
  clusterEvent: TemporalClusterBusterEvent,
  eventFeature: ExtendedFeature
): ApiEvent => {
  const vessel = clusterEvent.event_vessels.find(
    (v) => v.id === clusterEvent.vessel_id
  ) as EventVessel
  const encounterVessel = clusterEvent.event_vessels.find(
    (v) => v.id === clusterEvent.event_info?.encountered_vessel_id
  ) as EventVessel
  const event = {
    position: {
      lat: eventFeature.properties?.lat as number,
      lon: eventFeature.properties?.lng as number,
    },
    id: clusterEvent.event_id,
    type: clusterEvent.event_type,
    vessel,
    start: clusterEvent.event_start,
    end: clusterEvent.event_end,
    rfmos: clusterEvent.event_info?.regions?.rfmo,
    eezs: clusterEvent.event_info?.regions?.eez,
    encounter: {
      vessel: encounterVessel,
      authorized: clusterEvent.event_info.is_authorized,
      medianDistanceKilometers: clusterEvent.event_info.median_distance_km,
      medianSpeedKnots: clusterEvent.event_info.median_speed_knots,
      authorizationStatus: clusterEvent.event_info.authorization_status,
      regionAuthorizations: [],
      vesselAuthorizations: [],
    },
  }
  return event
}

export const fetchEncounterEventThunk = createAsyncThunk<
  ExtendedFeatureEvent | undefined,
  ExtendedFeature,
  {
    dispatch: AppDispatch
  }
>('map/fetchEncounterEvent', async (eventFeature, { signal, getState }) => {
  const state = getState() as RootState
  const eventDataviews = selectEventsDataviews(state) || []
  const dataview = eventDataviews.find((d) => d.id === eventFeature.generatorId)
  const dataset = dataview?.datasets?.find((d) => d.type === DatasetTypes.Events)
  if (dataset) {
    const datasetConfig = {
      datasetId: dataset.id,
      endpoint: 'carriers-events-detail',
      params: [{ id: 'eventId', value: eventFeature.id }],
    }
    const url = resolveEndpoint(dataset, datasetConfig)
    if (url) {
      const clusterEvent = await GFWAPI.fetch<TemporalClusterBusterEvent>(url, { signal })
      if (clusterEvent) {
        const event = parseClusterEvent(clusterEvent, eventFeature)
        return { ...event, dataset }
      }
    } else {
      console.warn('Missing url for endpoints', dataset, datasetConfig)
    }
  }
  return
})

const slice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setClickedEvent: (state, action: PayloadAction<SliceInteractionEvent | null>) => {
      if (action.payload === null) {
        state.clicked = null
        return
      }
      state.clicked = { ...action.payload }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetch4WingInteractionThunk.pending, (state, action) => {
      state.fourWingsStatus = AsyncReducerStatus.Loading
    })
    builder.addCase(fetch4WingInteractionThunk.fulfilled, (state, action) => {
      state.fourWingsStatus = AsyncReducerStatus.Finished
      if (!state.clicked || !state.clicked.features || !action.payload) return

      action.payload.vessels.forEach((sublayerVessels) => {
        const sublayer = state.clicked?.features?.find(
          (feature) =>
            feature.temporalgrid && feature.temporalgrid.sublayerId === sublayerVessels.sublayerId
        )
        if (!sublayer) return
        sublayer.vessels = sublayerVessels.vessels
      })
    })
    builder.addCase(fetch4WingInteractionThunk.rejected, (state, action) => {
      if (action.error.message === 'Aborted') {
        state.fourWingsStatus = AsyncReducerStatus.Idle
      } else {
        state.fourWingsStatus = AsyncReducerStatus.Error
      }
    })
    builder.addCase(fetchEncounterEventThunk.pending, (state, action) => {
      state.apiEventStatus = AsyncReducerStatus.Loading
    })
    builder.addCase(fetchEncounterEventThunk.fulfilled, (state, action) => {
      state.apiEventStatus = AsyncReducerStatus.Finished
      if (!state.clicked || !state.clicked.features || !action.payload) return
      const feature = state.clicked?.features?.find((feature) => feature.id && action.meta.arg.id)
      if (feature) {
        feature.event = action.payload
      }
    })
    builder.addCase(fetchEncounterEventThunk.rejected, (state, action) => {
      if (action.error.message === 'Aborted') {
        state.apiEventStatus = AsyncReducerStatus.Idle
      } else {
        state.apiEventStatus = AsyncReducerStatus.Error
      }
    })
  },
})

export const selectClickedEvent = (state: RootState) => state.map.clicked
export const selectFourWingsStatus = (state: RootState) => state.map.fourWingsStatus
export const selectApiEventStatus = (state: RootState) => state.map.apiEventStatus

export const { setClickedEvent } = slice.actions
export default slice.reducer
