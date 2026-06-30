import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { atom, useAtom, useAtomValue } from 'jotai'

import type { TrackSegment } from '@globalfishingwatch/api-types'
import { DatasetTypes, ResourceStatus } from '@globalfishingwatch/api-types'
import type { DatasetEventSource } from '@globalfishingwatch/datasets-client'
import { getDatasetSource } from '@globalfishingwatch/datasets-client'
import {
  getLayersStateHashAtom,
  useDeckLayerLoadedState,
  useGetDeckLayers,
} from '@globalfishingwatch/deck-layer-composer'
import type { UserTracksLayer, VesselLayer } from '@globalfishingwatch/deck-layers'
import type {
  HighlighterCallbackFnArgs,
  TimebarChartChunk,
  TimebarChartData,
  TimebarChartItem,
  TrackChunkProps,
  TrackEventChunkProps,
} from '@globalfishingwatch/timebar'

import { selectTimebarGraph } from 'features/app/selectors/app.timebar.selectors'
import {
  selectTimebarTrackDataviews,
  selectVesselsDataviews,
} from 'features/dataviews/selectors/dataviews.instances.selectors'
import { selectDebugOptions } from 'features/debug/debug.slice'
import { t } from 'features/i18n/i18n'
import { useTimebarVisualisationConnect } from 'features/timebar/timebar.hooks'
import { selectWorkspaceVisibleEventsArray } from 'features/workspace/workspace.selectors'
import { TimebarGraphs, TimebarVisualisations } from 'types'
import { getEventDescription } from 'utils/events'

const isVesselLayerInstance = (instance: VesselLayer | UserTracksLayer): instance is VesselLayer =>
  'getVesselTrackSegments' in instance

const getUserTrackHighlighterLabel = ({ chunk }: HighlighterCallbackFnArgs) => {
  return (chunk.props as TrackChunkProps)?.id || ''
}

const hasUniqueChunks = (segments: TrackSegment[]) => {
  return segments?.[0]?.some((segment) => segment.id)
}

const getStatus = (loaded: boolean) =>
  loaded ? ResourceStatus.Finished : ResourceStatus.Loading

export const hasTracksWithNoData = (tracks = [] as VesselTrackAtom) => {
  if (!tracks) {
    return false
  }
  return tracks.some(
    ({ chunks, status }) => status !== ResourceStatus.Loading && chunks.length === 0
  )
}

export const useVesselTracksLayers = () => {
  const dataviews = useSelector(selectVesselsDataviews)
  const ids = useMemo(() => {
    return dataviews.map((d) => d.id)
  }, [dataviews])
  const vessels = useGetDeckLayers<VesselLayer>(ids)
  return vessels
}

export const useTimebarTracksLayers = () => {
  const dataviews = useSelector(selectTimebarTrackDataviews)
  const ids = useMemo(() => {
    return dataviews.map((d) => d.id)
  }, [dataviews])
  const vessels = useGetDeckLayers<VesselLayer | UserTracksLayer>(ids)
  return vessels
}

export const useTimebarLayers = () => {
  const timebarGraph = useSelector(selectTimebarGraph)
  const vesselTracksLayers = useVesselTracksLayers()
  const timebarTracksLayers = useTimebarTracksLayers()

  return timebarGraph === TimebarGraphs.Speed || timebarGraph === TimebarGraphs.Depth
    ? vesselTracksLayers
    : timebarTracksLayers
}

const useTrackDataviews = () => {
  const timebarGraph = useSelector(selectTimebarGraph)
  const vesselDataviews = useSelector(selectVesselsDataviews)
  const timebarTrackDataviews = useSelector(selectTimebarTrackDataviews)
  return timebarGraph === TimebarGraphs.Speed || timebarGraph === TimebarGraphs.Depth
    ? vesselDataviews
    : timebarTrackDataviews
}

const useLayersStateHash = (trackDataviews: { id: string }[]) => {
  return useAtomValue(
    useMemo(() => getLayersStateHashAtom(trackDataviews.map((d) => d.id)), [trackDataviews])
  )
}

const vesselTracksAtom = atom<VesselTrackAtom | undefined>(undefined)
export const useTimebarVesselTracksData = () => {
  return useAtomValue(vesselTracksAtom)
}

type VesselTrackAtom = TimebarChartData<any>
export const useTimebarVesselTracks = () => {
  const { timebarVisualisation } = useTimebarVisualisationConnect()
  const timebarGraph = useSelector(selectTimebarGraph)
  const debugOptions = useSelector(selectDebugOptions)
  const [tracks, setVesselTracks] = useAtom(vesselTracksAtom)

  const trackLayers = useTimebarLayers()
  const loadedState = useDeckLayerLoadedState()
  const trackDataviews = useTrackDataviews()

  const tracksColorHash = useMemo(
    () =>
      trackLayers
        .flatMap((v) => {
          const color = v.instance.getColor()
          const cacheHash =
            'cacheHash' in v.instance && v.instance.cacheHash
              ? (v.instance.cacheHash as string)
              : ''
          if (!color && !cacheHash) {
            return []
          }
          return `${color}-${cacheHash}`
        })
        .join(','),
    [trackLayers]
  )

  const layersStateHash = useLayersStateHash(trackDataviews)

  useEffect(() => {
    requestAnimationFrame(() => {
      if (timebarVisualisation !== TimebarVisualisations.Vessel || !trackDataviews?.length) {
        setVesselTracks(undefined)
        return
      }
      const vesselTracks = trackDataviews.map((dataview) => {
        const instance = trackLayers.find((l) => l.id === dataview.id)?.instance
        const loaded = loadedState[dataview.id]?.loaded === true
        const status = getStatus(loaded)
        const segments =
          instance && loaded
            ? isVesselLayerInstance(instance)
              ? instance.getVesselTrackSegments({
                  ...((debugOptions?.vesselsAsPositions || instance?.props.gapSegmentThreshold) && {
                    includeMiddlePoints: true,
                  }),
                })
              : instance.getSegments()
            : []

        const trackGraphData: TimebarChartItem<{ color: string }> = {
          id: dataview.id,
          color: instance?.getColor() ?? dataview.config?.color,
          chunks: [] as TimebarChartChunk<{ color: string }>[],
          status,
          props: {
            segmentsOffsetY:
              !!instance && !isVesselLayerInstance(instance) && hasUniqueChunks(segments),
          },
          getHighlighterLabel: getUserTrackHighlighterLabel,
          getHighlighterIcon: 'vessel',
        }

        if (instance && segments?.length && status === ResourceStatus.Finished) {
          trackGraphData.chunks = segments.map((segment) => {
            const start = segment[0]?.timestamp
            const color = segment[0]?.color || instance.getColor()
            const end = segment[segment.length - 1]?.timestamp
            return {
              start,
              end,
              props: { color },
              values: segment,
            } as TimebarChartChunk<{ color: string }>
          })
        }
        return trackGraphData
      })
      setVesselTracks(vesselTracks as any)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layersStateHash, tracksColorHash, timebarGraph, timebarVisualisation])

  return tracks
}

const vesselTracksGraphAtom = atom<VesselTrackAtom | undefined>(undefined)

const getTrackGraphSpeedHighlighterLabel = ({ value }: HighlighterCallbackFnArgs) =>
  value ? `${value.value?.toFixed(2)} knots` : ''
const getTrackGraphElevationighlighterLabel = ({ value }: HighlighterCallbackFnArgs) =>
  value ? `${value.value} m` : ''

export const useTimebarVesselTracksGraph = () => {
  const { timebarVisualisation } = useTimebarVisualisationConnect()
  const timebarGraph = useSelector(selectTimebarGraph)
  const [tracksGraph, setVesselTracksGraph] = useAtom(vesselTracksGraphAtom)
  const trackLayers = useTimebarLayers()

  const tracksLoaded = useMemo(
    () =>
      trackLayers
        .flatMap((v) => {
          return isVesselLayerInstance(v.instance)
            ? v.instance.getVesselTracksLayersLoaded()
            : v.instance.isLoaded
              ? v.id
              : []
        })
        .join(','),
    [trackLayers]
  )
  const tracksColor = useMemo(
    () => trackLayers.flatMap((v) => v.instance.getColor()).join(','),
    [trackLayers]
  )

  useEffect(() => {
    if (
      !trackLayers?.length ||
      trackLayers?.length > 2 ||
      timebarVisualisation !== TimebarVisualisations.Vessel
    ) {
      return
    }
    setVesselTracksGraph((tracks) => {
      if (!tracks?.length) {
        return tracks
      }
      return tracks.map((track, index) => {
        if (!trackLayers[index]) {
          return track
        }
        return {
          ...track,
          color: trackLayers[index]?.instance?.getColor(),
        }
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracksColor, timebarVisualisation])

  useEffect(() => {
    requestAnimationFrame(() => {
      const showGraph = timebarGraph === TimebarGraphs.Speed || timebarGraph === TimebarGraphs.Depth
      if (
        showGraph &&
        trackLayers?.length &&
        trackLayers?.length <= 2 &&
        timebarVisualisation === TimebarVisualisations.Vessel
      ) {
        const vesselTracks = trackLayers.flatMap(({ instance }) => {
          const loaded = isVesselLayerInstance(instance)
            ? instance.getVesselTracksLayersLoaded()
            : instance.isLoaded
          const status = getStatus(!!loaded)
          const trackGraphData: TimebarChartItem = {
            id: instance.id,
            color: instance.getColor(),
            chunks: [] as TimebarChartChunk[],
            status,
            getHighlighterLabel:
              timebarGraph === TimebarGraphs.Speed
                ? getTrackGraphSpeedHighlighterLabel
                : getTrackGraphElevationighlighterLabel,
            getHighlighterIcon: 'vessel',
            filters: {
              ...(isVesselLayerInstance(instance) ? instance.getFilters() : {}),
            },
          }

          const segments = isVesselLayerInstance(instance)
            ? instance.getVesselTrackSegments({ includeMiddlePoints: true })
            : instance.getSegments()

          if (segments?.length && status === ResourceStatus.Finished) {
            trackGraphData.chunks = segments?.flatMap((segment) => {
              if (!segment) {
                return []
              }
              return {
                start: segment[0].timestamp || Number.POSITIVE_INFINITY,
                // TODO This assumes that segments ends at last value's timestamp, which is probably incorrect
                end: segment[segment.length - 1].timestamp || Number.NEGATIVE_INFINITY,
                values: segment.map((segmentPoint) => {
                  const value = (segmentPoint as any)?.[timebarGraph]
                  return {
                    timestamp: segmentPoint.timestamp,
                    value,
                  }
                }),
              } as TimebarChartChunk
            })
          }
          return trackGraphData
        })
        setVesselTracksGraph(vesselTracks as any)
      } else if (tracksGraph) {
        setVesselTracksGraph(undefined)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracksLoaded, timebarGraph, tracksGraph, timebarVisualisation])

  const tracksFiltersHash = useMemo(() => {
    return trackLayers
      .flatMap(({ instance }) => [
        isVesselLayerInstance(instance) ? Object.values(instance.getFilters()).filter(Boolean) : [],
      ])
      .join(',')
  }, [trackLayers])

  useEffect(() => {
    setVesselTracksGraph((tracksGraph) => {
      return tracksGraph?.map((graph) => {
        const trackLayerInstance = trackLayers.find(
          (layer) => layer.instance?.id === graph.id
        )?.instance
        if (!trackLayerInstance) {
          return graph
        }
        const filters = isVesselLayerInstance(trackLayerInstance)
          ? trackLayerInstance.getFilters()
          : {}
        return {
          ...graph,
          filters,
        } as TimebarChartItem
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracksFiltersHash])

  return tracksGraph
}

const getTrackEventHighlighterLabel = (
  { chunk, expanded }: HighlighterCallbackFnArgs,
  { source }: { source?: DatasetEventSource } = {}
): string => {
  const { description, descriptionGeneric } = getEventDescription(chunk as any, { source })
  if (chunk.cluster) {
    return `${descriptionGeneric} (${chunk.cluster.numChunks} ${t((t) => t.event.events)})`
  }
  if (expanded) {
    return description as string
  }
  return descriptionGeneric as string
}

export const useTimebarVesselEvents = () => {
  const { timebarVisualisation } = useTimebarVisualisationConnect()
  const timebarGraph = useSelector(selectTimebarGraph)
  const visibleEvents = useSelector(selectWorkspaceVisibleEventsArray)
  const trackDataviews = useTrackDataviews()
  const loadedState = useDeckLayerLoadedState()
  const [timebarVesselEvents, setTimebarVesselEvents] =
    useState<TimebarChartData<TrackEventChunkProps> | null>(null)
  const vessels = useTimebarLayers()
  const layersStateHash = useLayersStateHash(trackDataviews)
  const eventsColor = useMemo(
    () => vessels.flatMap((v) => v.instance.getColor()).join(','),
    [vessels]
  )

  useEffect(() => {
    requestAnimationFrame(() => {
      if (
        !trackDataviews?.length ||
        !visibleEvents?.length ||
        timebarVisualisation !== TimebarVisualisations.Vessel
      ) {
        setTimebarVesselEvents(null)
        return
      }
      const vesselEvents: TimebarChartData<any> = trackDataviews.map((dataview) => {
        const instance = vessels.find((v) => v.id === dataview.id)?.instance
        const loaded = loadedState[dataview.id]?.loaded === true
        const status = getStatus(loaded)
        const infoDataset = dataview?.datasets?.find((d) => d.type === DatasetTypes.Vessels)
        const source = getDatasetSource(infoDataset?.id)
        return {
          id: dataview.id,
          color: instance?.getColor() ?? dataview.config?.color,
          chunks:
            instance && loaded && isVesselLayerInstance(instance)
              ? instance.getVesselEventsData(visibleEvents)
              : [],
          status,
          defaultLabel: instance && isVesselLayerInstance(instance) ? instance.getVesselName() : '',
          getHighlighterLabel: (e) => getTrackEventHighlighterLabel(e, { source }),
          getHighlighterIcon: 'vessel',
        } as TimebarChartItem<any>
      })
      setTimebarVesselEvents(vesselEvents)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layersStateHash, timebarGraph, visibleEvents, eventsColor, timebarVisualisation])

  return timebarVesselEvents
}
