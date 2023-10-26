import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { uniqBy } from 'lodash'
import { InteractionEvent, ExtendedFeature } from '@globalfishingwatch/react-hooks'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { resolveEndpoint, UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import {
  DataviewDatasetConfig,
  Dataset,
  IdentityVessel,
  DatasetTypes,
  ApiEvent,
  EndpointId,
  EventVessel,
  EventVesselTypeEnum,
  APIPagination,
} from '@globalfishingwatch/api-types'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { AsyncReducerStatus } from 'utils/async-slice'
import { AppDispatch } from 'store'
import {
  selectEventsDataviews,
  selectActiveTemporalgridDataviews,
} from 'features/dataviews/dataviews.selectors'
import { fetchDatasetByIdThunk, selectDatasetById } from 'features/datasets/datasets.slice'
import { isGuestUser } from 'features/user/user.slice'
import { getRelatedDatasetByType, getRelatedDatasetsByType } from 'features/datasets/datasets.utils'
import { getVesselProperty } from 'features/vessel/vessel.utils'

export const MAX_TOOLTIP_LIST = 5

export type ExtendedFeatureVesselDatasets = IdentityVessel & {
  id: string
  dataset: Dataset
  infoDataset?: Dataset
  trackDataset?: Dataset
}

// TODO extract this type in app types
export type ExtendedFeatureVessel = ExtendedFeatureVesselDatasets & {
  hours: number
  [key: string]: any
}

export type ExtendedEventVessel = EventVessel & { dataset?: string }

export type ExtendedFeatureEvent = ApiEvent<EventVessel> & { dataset: Dataset }

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
  isDrawing: boolean
  fishingStatus: AsyncReducerStatus
  currentFishingRequestId: string
  apiEventStatus: AsyncReducerStatus
}

const initialState: MapState = {
  clicked: null,
  hovered: null,
  isDrawing: false,
  fishingStatus: AsyncReducerStatus.Idle,
  currentFishingRequestId: '',
  apiEventStatus: AsyncReducerStatus.Idle,
}

type SublayerVessels = {
  sublayerId: string
  vessels: ExtendedFeatureVessel[]
}

const getInteractionEndpointDatasetConfig = (
  features: ExtendedFeature[],
  temporalgridDataviews: UrlDataviewInstance[] = []
) => {
  // use the first feature/dv for common parameters
  const mainFeature = features[0]
  // Currently only one timerange is supported, which is OK since we only need interaction on the activity heatmaps and all
  // activity heatmaps use the same time intervals, This will need to be revised in case we support interactivity on environment layers
  const start = mainFeature.temporalgrid?.visibleStartDate
  const end = mainFeature.temporalgrid?.visibleEndDate

  // get corresponding dataviews
  const featuresDataviews = features.flatMap((feature) => {
    return feature.temporalgrid
      ? temporalgridDataviews.find(
          (dataview) => dataview.id === feature?.temporalgrid?.sublayerId
        ) || []
      : []
  })
  const fourWingsDataset = featuresDataviews[0]?.datasets?.find(
    (d) => d.type === DatasetTypes.Fourwings
  ) as Dataset

  // get corresponding datasets
  const datasets: string[][] = featuresDataviews.map((dv) => {
    return dv.config?.datasets || []
  })

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
  if (filters.length) {
    datasetConfig.query?.push({ id: 'filters', value: filters })
  }

  const vesselGroups = featuresDataviews
    .map((dv) => dv.config?.['vessel-groups'] || [])
    .filter((vg) => vg.length)

  if (vesselGroups.length) {
    datasetConfig.query?.push({ id: 'vessel-groups', value: vesselGroups })
  }

  return { featuresDataviews, fourWingsDataset, datasetConfig }
}

export const getVesselInfoEndpoint = (vesselDatasets: Dataset[], vesselIds: string[]) => {
  if (!vesselDatasets || !vesselDatasets.length || !vesselIds || !vesselIds.length) {
    return null
  }
  const datasetConfig = {
    endpoint: EndpointId.VesselList,
    datasetId: vesselDatasets?.[0]?.id,
    params: [],
    query: [
      {
        id: 'datasets',
        value: vesselDatasets.map((d) => d.id),
      },
      {
        id: 'ids',
        value: vesselIds,
      },
    ],
  }
  return resolveEndpoint(vesselDatasets[0], datasetConfig)
}

export const fetchVesselInfo = async (
  datasets: Dataset[],
  vesselIds: string[],
  signal: AbortSignal
) => {
  const vesselsInfoUrl = getVesselInfoEndpoint(datasets, vesselIds)
  if (!vesselsInfoUrl) {
    console.warn('No vessel info url found for dataset', datasets)
    console.warn('and vesselIds', vesselIds)
    return
  }
  try {
    const vesselsInfoResponse = await GFWAPI.fetch<APIPagination<IdentityVessel>>(vesselsInfoUrl, {
      signal,
    })
    // TODO remove entries once the API is stable
    const vesselsInfoList: IdentityVessel[] =
      !vesselsInfoResponse.entries || typeof vesselsInfoResponse.entries === 'function'
        ? vesselsInfoResponse
        : (vesselsInfoResponse as any)?.entries
    return vesselsInfoList || []
  } catch (e: any) {
    console.warn(e)
  }
}

export type ActivityProperty = 'hours' | 'detections'
export const fetchFishingActivityInteractionThunk = createAsyncThunk<
  { vessels: SublayerVessels[] } | undefined,
  { fishingActivityFeatures: ExtendedFeature[]; activityProperties?: ActivityProperty[] },
  {
    dispatch: AppDispatch
  }
>(
  'map/fetchFishingActivityInteraction',
  async ({ fishingActivityFeatures, activityProperties }, { getState, signal, dispatch }) => {
    const state = getState() as any
    const guestUser = isGuestUser(state)
    const temporalgridDataviews = selectActiveTemporalgridDataviews(state) || []
    if (!fishingActivityFeatures.length) {
      console.warn('fetchInteraction not possible, 0 features')
      return
    }
    const { featuresDataviews, fourWingsDataset, datasetConfig } =
      getInteractionEndpointDatasetConfig(fishingActivityFeatures, temporalgridDataviews)

    const interactionUrl = resolveEndpoint(fourWingsDataset, datasetConfig)
    if (interactionUrl) {
      const sublayersVesselsIdsResponse = await GFWAPI.fetch<APIPagination<ExtendedFeatureVessel>>(
        interactionUrl,
        { signal }
      )

      const sublayersVesselsIds = sublayersVesselsIdsResponse.entries.map((sublayer) =>
        sublayer.map((vessel: any) => {
          const { id, vessel_id, ...rest } = vessel
          // vessel_id needed for VIIRS layers
          return { ...rest, id: id || vessel_id }
        })
      )

      let startingIndex = 0
      const vesselsBySource: ExtendedFeatureVessel[][][] = featuresDataviews.map((dataview) => {
        const datasets: string[] = dataview.config?.datasets
        const newStartingIndex = startingIndex + datasets.length
        const dataviewVesselsIds = sublayersVesselsIds.slice(startingIndex, newStartingIndex)
        startingIndex = newStartingIndex
        return dataviewVesselsIds.map((vessels, i) => {
          const dataset = selectDatasetById(datasets[i])(state)
          return vessels.flatMap((vessel: ExtendedFeatureVessel) => ({
            ...vessel,
            dataset,
          }))
        })
      })

      const topActivityVessels = vesselsBySource
        .map((source, i) => {
          const activityProperty = activityProperties?.[i] || 'hours'
          return source
            .flatMap((source) => source)
            .sort((a, b) => b[activityProperty] - a[activityProperty])
            .filter((v) => v.id !== null)
            .slice(0, MAX_TOOLTIP_LIST)
        })
        .flatMap((v) => v)

      const topActivityVesselsDatasets = uniqBy(
        topActivityVessels.map(({ dataset }) => dataset),
        'id'
      )
      // Grab related dataset to fetch info from and prepare tracks
      const allInfoDatasets = await Promise.all(
        topActivityVesselsDatasets.flatMap(async (dataset) => {
          const infoDatasets = getRelatedDatasetsByType(dataset, DatasetTypes.Vessels, !guestUser)
          if (!infoDatasets) {
            return []
          }
          return await Promise.all(
            infoDatasets.flatMap(async ({ id }) => {
              let infoDataset = selectDatasetById(id)(state)
              if (!infoDataset) {
                // It needs to be request when it hasn't been loaded yet
                const action = await dispatch(fetchDatasetByIdThunk(id))
                if (fetchDatasetByIdThunk.fulfilled.match(action)) {
                  infoDataset = action.payload
                }
              }
              return infoDataset
            })
          )
        })
      )

      const infoDatasets = allInfoDatasets.flatMap((datasets) => datasets.flatMap((d) => d || []))
      const topActivityVesselIds = topActivityVessels.map(({ id }) => id)

      const vesselsInfo = await fetchVesselInfo(infoDatasets, topActivityVesselIds, signal)

      const sublayersIds = fishingActivityFeatures.map(
        (feature) => feature.temporalgrid?.sublayerId || ''
      )

      const sublayersVessels: SublayerVessels[] = vesselsBySource.map((sublayerVessels, i) => {
        const activityProperty = activityProperties?.[i] || 'hours'
        return {
          sublayerId: sublayersIds[i],
          vessels: sublayerVessels
            .flatMap((vessels) => {
              return vessels.map((vessel) => {
                const vesselInfo = vesselsInfo?.find((vesselInfo) => {
                  const vesselInfoId = vesselInfo.selfReportedInfo?.[0]?.id
                  return vesselInfoId === vessel.id
                })
                const infoDataset = selectDatasetById(vesselInfo?.dataset as string)(state)
                const trackFromRelatedDataset = infoDataset || vessel.dataset
                const trackDatasetId = getRelatedDatasetByType(
                  trackFromRelatedDataset,
                  DatasetTypes.Tracks,
                  { fullDatasetAllowed: !guestUser }
                )?.id
                // if (vesselInfo && !trackDatasetId) {
                //   console.warn('No track dataset found for dataset:', trackFromRelatedDataset)
                //   console.warn('and vessel:', vessel)
                // }
                const trackDataset = selectDatasetById(trackDatasetId as string)(state)
                return {
                  ...vessel,
                  ...(vesselInfo || {}),
                  id: vesselInfo?.selfReportedInfo?.[0]?.id || vessel.id,
                  infoDataset,
                  trackDataset,
                } as ExtendedFeatureVessel
              })
            })
            .sort((a: any, b: any) => b[activityProperty] - a[activityProperty]),
        }
      })
      return { vessels: sublayersVessels }
    }
  }
)

export const fetchEncounterEventThunk = createAsyncThunk<
  ExtendedFeatureEvent | undefined,
  ExtendedFeature,
  {
    dispatch: AppDispatch
  }
>('map/fetchEncounterEvent', async (eventFeature, { signal, getState }) => {
  const state = getState() as any
  const eventDataviews = selectEventsDataviews(state) || []
  const dataview = eventDataviews.find((d) => d.id === eventFeature.generatorId)
  const dataset = dataview?.datasets?.find((d) => d.type === DatasetTypes.Events)

  if (dataset) {
    const datasetConfig = {
      datasetId: dataset.id,
      endpoint: EndpointId.EventsDetail,
      params: [{ id: 'eventId', value: eventFeature.id }],
      query: [{ id: 'dataset', value: dataset.id }],
    }
    const url = resolveEndpoint(dataset, datasetConfig)
    if (url) {
      const clusterEvent = await GFWAPI.fetch<ApiEvent>(url, { signal })

      // Workaround to grab information about each vessel dataset
      // will need discuss with API team to scale this for other types
      const isACarrierTheMainVessel = clusterEvent.vessel.type === EventVesselTypeEnum.Carrier
      const fishingVessel = isACarrierTheMainVessel
        ? clusterEvent.encounter?.vessel
        : clusterEvent.vessel
      const carrierVessel = isACarrierTheMainVessel
        ? clusterEvent.vessel
        : clusterEvent.encounter?.vessel
      let vesselsInfo: IdentityVessel[] = []
      const vesselsDatasets = dataview?.datasets
        ?.flatMap((d) => d.relatedDatasets || [])
        .filter((d) => d?.type === DatasetTypes.Vessels)

      if (vesselsDatasets?.length && fishingVessel && carrierVessel) {
        const vesselDataset = selectDatasetById(vesselsDatasets[0].id)(state) as Dataset
        const vesselsDatasetConfig = {
          datasetId: vesselDataset.id,
          endpoint: EndpointId.VesselList,
          params: [],
          query: [
            { id: 'ids', value: [fishingVessel.id, carrierVessel.id] },
            { id: 'datasets', value: vesselsDatasets.map((d) => d.id) },
          ],
        }
        const vesselsUrl = resolveEndpoint(vesselDataset, vesselsDatasetConfig)
        if (vesselsUrl) {
          vesselsInfo = await GFWAPI.fetch<APIPagination<IdentityVessel>>(vesselsUrl, {
            signal,
          }).then((r) => r.entries)
        }
      }
      if (clusterEvent) {
        const fishingVesselDataset =
          vesselsInfo.find(
            (v) =>
              getVesselProperty(v, 'id', {
                identitySource: VesselIdentitySourceEnum.SelfReported,
              }) === fishingVessel?.id
          )?.dataset || ''
        const carrierVesselDataset =
          vesselsInfo.find(
            (v) =>
              getVesselProperty(v, 'id', {
                identitySource: VesselIdentitySourceEnum.SelfReported,
              }) === carrierVessel?.id
          )?.dataset || ''
        const carrierExtendedVessel: ExtendedEventVessel = {
          ...(carrierVessel as EventVessel),
          dataset: carrierVesselDataset,
        }
        const fishingExtendedVessel: ExtendedEventVessel = {
          ...(fishingVessel as EventVessel),
          dataset: fishingVesselDataset,
        }
        return {
          ...clusterEvent,
          vessel: carrierExtendedVessel,
          ...(clusterEvent.encounter && {
            encounter: {
              ...clusterEvent.encounter,
              vessel: fishingExtendedVessel,
            },
          }),
          dataset,
        }
      }
    } else {
      console.warn('Missing url for endpoints', dataset, datasetConfig)
    }
  }
  return
})

type BQClusterEvent = Record<string, any>
export const fetchBQEventThunk = createAsyncThunk<
  BQClusterEvent | undefined,
  ExtendedFeature,
  {
    dispatch: AppDispatch
  }
>('map/fetchBQEvent', async (eventFeature, { signal, getState }) => {
  const state = getState()
  const eventDataviews = selectEventsDataviews(state) || []
  const dataview = eventDataviews.find((d) => d.id === eventFeature.generatorId)
  const dataset = dataview?.datasets?.find((d) => d.type === DatasetTypes.Events)
  if (dataset) {
    const datasetConfig = {
      datasetId: dataset.id,
      endpoint: EndpointId.EventsDetail,
      params: [{ id: 'eventId', value: eventFeature.id }],
      query: [{ id: 'raw', value: true }],
    }
    const url = resolveEndpoint(dataset, datasetConfig)
    if (url) {
      const clusterEvent = await GFWAPI.fetch<BQClusterEvent>(url, { signal })
      return clusterEvent
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
    setMapDrawing: (state, action: PayloadAction<boolean>) => {
      state.isDrawing = action.payload
    },
    setClickedEvent: (state, action: PayloadAction<SliceInteractionEvent | null>) => {
      if (action.payload === null) {
        state.clicked = null
        return
      }
      state.clicked = { ...action.payload }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchFishingActivityInteractionThunk.pending, (state, action) => {
      state.fishingStatus = AsyncReducerStatus.Loading
      state.currentFishingRequestId = action.meta.requestId
    })
    builder.addCase(fetchFishingActivityInteractionThunk.fulfilled, (state, action) => {
      state.fishingStatus = AsyncReducerStatus.Finished
      state.currentFishingRequestId = ''
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
    builder.addCase(fetchFishingActivityInteractionThunk.rejected, (state, action) => {
      if (action.error.message === 'Aborted') {
        state.fishingStatus =
          state.currentFishingRequestId !== action.meta.requestId
            ? AsyncReducerStatus.Loading
            : AsyncReducerStatus.Idle
      } else {
        state.fishingStatus = AsyncReducerStatus.Error
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
    builder.addCase(fetchBQEventThunk.pending, (state, action) => {
      state.apiEventStatus = AsyncReducerStatus.Loading
    })
    builder.addCase(fetchBQEventThunk.fulfilled, (state, action) => {
      state.apiEventStatus = AsyncReducerStatus.Finished
      if (!state.clicked || !state.clicked.features || !action.payload) return
      const feature = state.clicked?.features?.find((feature) => feature.id && action.meta.arg.id)
      if (feature && action.payload) {
        feature.properties = { ...feature.properties, ...action.payload }
      }
    })
    builder.addCase(fetchBQEventThunk.rejected, (state, action) => {
      if (action.error.message === 'Aborted') {
        state.apiEventStatus = AsyncReducerStatus.Idle
      } else {
        state.apiEventStatus = AsyncReducerStatus.Error
      }
    })
  },
})

export const selectClickedEvent = (state: { map: MapState }) => state.map.clicked
export const selectIsMapDrawing = (state: { map: MapState }) => state.map.isDrawing
export const selectFishingInteractionStatus = (state: { map: MapState }) => state.map.fishingStatus
export const selectApiEventStatus = (state: { map: MapState }) => state.map.apiEventStatus

export const { setClickedEvent, setMapDrawing } = slice.actions
export default slice.reducer
