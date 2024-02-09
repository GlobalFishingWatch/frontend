import { createSelector } from '@reduxjs/toolkit'
import { FeatureCollection } from 'geojson'
import {
  DatasetTypes,
  Resource,
  ResourceStatus,
  TrackResourceData,
  EndpointId,
  EventType,
} from '@globalfishingwatch/api-types'
import {
  resolveDataviewDatasetResource,
  resolveDataviewDatasetResources,
  pickTrackResource,
  getDatasetsExtent,
} from '@globalfishingwatch/dataviews-client'
import {
  TrackCoordinatesPropertyFilter,
  geoJSONToSegments,
  getSegmentExtents,
  getTimeFilter,
  getTrackFilters,
  filterTrackByCoordinateProperties,
} from '@globalfishingwatch/data-transforms'
import {
  TimebarChartData,
  TimebarChartChunk,
  TimebarChartItem,
  TimebarChartValue,
  TrackEventChunkProps,
  HighlighterCallbackFnArgs,
} from '@globalfishingwatch/timebar'
import { selectVisibleEvents } from 'features/app/selectors/app.selectors'
import { t } from 'features/i18n/i18n'
import { selectResources } from 'features/resources/resources.slice'
import { getVesselLabel } from 'utils/info'
import { MAX_TIMEBAR_VESSELS } from 'features/timebar/timebar.config'
import { TimebarGraphs } from 'types'
import {
  selectActiveTrackDataviews,
  selectActiveVesselsDataviews,
  selectDataviewInstancesResolved,
} from 'features/dataviews/selectors/dataviews.instances.selectors'
import { selectTimebarGraph } from 'features/app/selectors/app.timebar.selectors'
import { AVAILABLE_END, AVAILABLE_START } from 'data/config'
import { getDatasetsInDataviews } from 'features/datasets/datasets.utils'
import { selectAllDatasets } from 'features/datasets/datasets.slice'

export const selectDatasetsExtent = createSelector(
  [selectDataviewInstancesResolved, selectAllDatasets],
  (dataviews, datasets) => {
    const activeDataviewDatasets = getDatasetsInDataviews(dataviews)
    const activeDatasets = datasets.filter((d) => activeDataviewDatasets.includes(d.id))
    return getDatasetsExtent(activeDatasets, {
      format: 'timestamp',
    })
  }
)

export const selectAvailableStart = createSelector([selectDatasetsExtent], (datasetsExtent) => {
  const defaultAvailableStartMs = new Date(AVAILABLE_START).getTime()
  const availableStart = new Date(
    Math.min(defaultAvailableStartMs, (datasetsExtent.extentStart as number) || Infinity)
  ).toISOString()
  return availableStart
})

export const selectAvailableEnd = createSelector([selectDatasetsExtent], (datasetsExtent) => {
  const defaultAvailableEndMs = new Date(AVAILABLE_END).getTime()
  const availableEndMs = new Date(
    Math.max(defaultAvailableEndMs, (datasetsExtent.extentEnd as number) || -Infinity)
  ).toISOString()
  return availableEndMs
})

const EMPTY_ARRAY: [] = []

const getUserTrackHighlighterLabel = ({ chunk }: HighlighterCallbackFnArgs) => {
  return chunk.props?.id || null
}

export const selectTracksData = createSelector(
  [selectActiveTrackDataviews, selectResources],
  (trackDataviews, resources) => {
    if (!trackDataviews || trackDataviews.length > MAX_TIMEBAR_VESSELS || !resources) return
    const tracksSegments: TimebarChartData = trackDataviews.flatMap((dataview) => {
      const timebarTrack: TimebarChartItem = {
        color: dataview.config?.color,
        chunks: [],
        status: ResourceStatus.Idle,
      }

      const endpointType =
        dataview.datasets && dataview.datasets?.[0]?.type === DatasetTypes.UserTracks
          ? EndpointId.UserTracks
          : EndpointId.Tracks

      let trackResource
      if (endpointType === EndpointId.Tracks) {
        trackResource = pickTrackResource(dataview, EndpointId.Tracks, resources)
      } else {
        const { url } = resolveDataviewDatasetResource(dataview, [DatasetTypes.UserTracks])
        trackResource = resources[url] as Resource<TrackResourceData>
      }

      if (!trackResource) {
        return { ...timebarTrack, status: ResourceStatus.Idle }
      } else if (trackResource.status === ResourceStatus.Loading) {
        return { ...timebarTrack, status: ResourceStatus.Loading }
      } else if (
        trackResource.status === ResourceStatus.Error ||
        (trackResource.status === ResourceStatus.Finished && !trackResource?.data)
      ) {
        return { ...timebarTrack, status: ResourceStatus.Error }
      }

      const dataviewFilters = dataview?.config?.filters
      const isGeoJSONTrack = (trackResource.data as FeatureCollection)?.features?.length > 0

      const filters: TrackCoordinatesPropertyFilter[] = [
        ...getTrackFilters(dataviewFilters),
        // This is done to allow times property to pass the filtering
        // and reach the timebar, where timebased filtering is done
        ...getTimeFilter(AVAILABLE_START, AVAILABLE_END),
      ]
      const filteredFeatures =
        isGeoJSONTrack && dataviewFilters
          ? filterTrackByCoordinateProperties(trackResource.data as FeatureCollection, { filters })
          : (trackResource.data as FeatureCollection)

      const segmentExtents: any = isGeoJSONTrack
        ? geoJSONToSegments(filteredFeatures as FeatureCollection, { onlyExtents: true })
        : getSegmentExtents((trackResource.data as any) || ([] as any))

      const chunks: TimebarChartChunk[] = segmentExtents.map((segment: any) => {
        const useOwnColor = trackDataviews.length === 1 && endpointType === EndpointId.UserTracks
        return {
          start: segment[0].timestamp || Number.POSITIVE_INFINITY,
          // TODO This assumes that segments ends at last value's timestamp, which is probably incorrect
          end: segment[segment.length - 1].timestamp || Number.NEGATIVE_INFINITY,
          values: segment as TimebarChartValue[],
          props: {
            ...segment[0],
            id: segment[0]?.id,
            color: useOwnColor ? segment[0]?.color : undefined,
          },
        }
      })

      const { url: infoUrl } = resolveDataviewDatasetResource(dataview, DatasetTypes.Vessels)
      const vessel = (resources[infoUrl] as any)?.data
      const shipname =
        trackResource.dataset.type === DatasetTypes.UserTracks
          ? dataview.datasets!?.[0]?.name
          : getVesselLabel(vessel)

      const item: TimebarChartItem = {
        ...timebarTrack,
        chunks,
        status: ResourceStatus.Finished,
        defaultLabel: shipname || '',
        getHighlighterLabel:
          trackResource.dataset.type === DatasetTypes.UserTracks
            ? getUserTrackHighlighterLabel
            : undefined,
        getHighlighterIcon:
          trackResource.dataset.type === DatasetTypes.UserTracks ? 'track' : 'vessel',
        props: {
          segmentsOffsetY: trackResource.dataset.type === DatasetTypes.UserTracks,
        },
      }
      return item
    })
    return tracksSegments
  }
)

export const selectHasTracksData = createSelector([selectTracksData], (tracks = []) => {
  return tracks.some(({ chunks }) => chunks.length > 0)
})

export const selectHasTracksWithNoData = createSelector([selectTracksData], (tracks = []) => {
  return tracks.some(
    ({ chunks, status }) => status !== ResourceStatus.Loading && chunks.length === 0
  )
})

const getTrackGraphSpeedHighlighterLabel = ({ value }: HighlighterCallbackFnArgs) =>
  value ? `${value.value?.toFixed(2)} knots` : ''
const getTrackGraphElevationighlighterLabel = ({ value }: HighlighterCallbackFnArgs) =>
  value ? `${value.value} m` : ''

export const selectTracksGraphData = createSelector(
  [selectActiveVesselsDataviews, selectResources, selectTimebarGraph],
  (vesselDataviews, resources, timebarGraphType) => {
    if (!resources) return
    const tracksGraphsData: TimebarChartData = vesselDataviews.flatMap((dataview) => {
      const trackGraphData: TimebarChartItem = {
        color: dataview.config?.color,
        chunks: [],
        status: ResourceStatus.Idle,
        getHighlighterLabel:
          timebarGraphType === TimebarGraphs.Speed
            ? getTrackGraphSpeedHighlighterLabel
            : getTrackGraphElevationighlighterLabel,
        getHighlighterIcon: 'vessel',
      }

      const resourcesQueries = resolveDataviewDatasetResources(dataview, DatasetTypes.Tracks)
      const resourceQuery = resourcesQueries.find(
        (r) =>
          r.datasetConfig.query?.find(
            (q) =>
              q.id === 'fields' &&
              (q.value.toString().includes(timebarGraphType) ||
                q.value.toString().toLowerCase().includes(timebarGraphType))
          )
      )
      const graphUrl = resourceQuery?.url
      if (!graphUrl) return trackGraphData
      const graphResource = resources[graphUrl] as Resource<TrackResourceData>

      if (!graphResource || graphResource.status === ResourceStatus.Loading) {
        return { ...trackGraphData, status: ResourceStatus.Loading }
      } else if (
        graphResource.status === ResourceStatus.Error ||
        (graphResource.status === ResourceStatus.Finished && !graphResource?.data)
      ) {
        return { ...trackGraphData, status: ResourceStatus.Error }
      }
      const graphChunks: TimebarChartChunk[] = graphResource.data!?.flatMap((segment) => {
        if (!segment) {
          return EMPTY_ARRAY
        }
        return {
          start: segment[0].timestamp || Number.POSITIVE_INFINITY,
          // TODO This assumes that segments ends at last value's timestamp, which is probably incorrect
          end: segment[segment.length - 1].timestamp || Number.NEGATIVE_INFINITY,
          values: segment.map((segmentPoint) => {
            const value = (segmentPoint as any)?.[timebarGraphType]
            return {
              timestamp: segmentPoint.timestamp,
              value,
            }
          }),
        } as TimebarChartChunk
      })

      trackGraphData.chunks = graphChunks
      return trackGraphData
    })
    return tracksGraphsData
  }
)

const getTrackEventHighlighterLabel = ({ chunk, expanded }: HighlighterCallbackFnArgs) => {
  if (chunk.cluster) {
    return `${chunk.props?.descriptionGeneric} (${chunk.cluster.numChunks} ${t(
      'event.events',
      'events'
    )})`
  }
  if (expanded) {
    return chunk.props?.description
  }
  return chunk.props?.descriptionGeneric
}

export const selectTracksEvents = createSelector(
  [selectActiveTrackDataviews, selectResources, selectVisibleEvents],
  (trackDataviews, resources, visibleEvents) => {
    if (!trackDataviews || trackDataviews.length > MAX_TIMEBAR_VESSELS) {
      return EMPTY_ARRAY
    }
    const tracksEvents: TimebarChartData<TrackEventChunkProps> = trackDataviews.map((dataview) => {
      const { url: infoUrl } = resolveDataviewDatasetResource(dataview, DatasetTypes.Vessels)
      const vessel = (resources[infoUrl] as any)?.data
      const shipname = vessel ? getVesselLabel(vessel) : ''
      const trackEvents: TimebarChartItem<TrackEventChunkProps> = {
        color: trackDataviews.length === 1 ? 'white' : dataview.config?.color,
        chunks: [],
        status: ResourceStatus.Idle,
        defaultLabel: shipname,
        getHighlighterLabel: getTrackEventHighlighterLabel,
        getHighlighterIcon: 'vessel',
      }
      if (Array.isArray(visibleEvents) && visibleEvents?.length === 0) return trackEvents

      const eventsResources = resolveDataviewDatasetResources(dataview, DatasetTypes.Events)
      if (!eventsResources.length) {
        return trackEvents
      }

      const eventsResourcesFiltered = eventsResources.filter(({ dataset }) => {
        if (visibleEvents === 'all') {
          return true
        }
        return dataset.subcategory && visibleEvents.includes(dataset.subcategory as EventType)
      })

      trackEvents.chunks = eventsResourcesFiltered.flatMap(({ url }) => {
        if (!url || !resources[url] || !resources[url].data) {
          return EMPTY_ARRAY
        }

        return resources[url].data as TimebarChartChunk<TrackEventChunkProps>[]
      })
      const statuses = eventsResourcesFiltered.map(({ url }) => resources[url]?.status)

      if (statuses.some((s) => s === ResourceStatus.Error)) {
        trackEvents.status = ResourceStatus.Error
      } else if (statuses.every((s) => s === ResourceStatus.Finished)) {
        trackEvents.status = ResourceStatus.Finished
      } else {
        trackEvents.status = ResourceStatus.Loading
      }

      return trackEvents
    })
    return tracksEvents
  }
)
