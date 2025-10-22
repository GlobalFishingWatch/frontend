import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { atom, useAtom, useAtomValue } from 'jotai'

import type { TrackSegment } from '@globalfishingwatch/api-types'
import { ResourceStatus } from '@globalfishingwatch/api-types'
import { useGetDeckLayers } from '@globalfishingwatch/deck-layer-composer'
import { UserTracksLayer, VesselLayer } from '@globalfishingwatch/deck-layers'
import type {
  HighlighterCallbackFnArgs,
  TimebarChartChunk,
  TimebarChartData,
  TimebarChartItem,
  TrackEventChunkProps,
} from '@globalfishingwatch/timebar'

import { selectTimebarGraph } from 'features/app/selectors/app.timebar.selectors'
import { selectActiveVesselsDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import {
  selectTimebarTrackDataviews,
  selectVesselsDataviews,
} from 'features/dataviews/selectors/dataviews.instances.selectors'
import { t } from 'features/i18n/i18n'
import { useTimebarVisualisationConnect } from 'features/timebar/timebar.hooks'
import { selectWorkspaceVisibleEventsArray } from 'features/workspace/workspace.selectors'
import { TimebarGraphs, TimebarVisualisations } from 'types'
import { getEventDescription } from 'utils/events'

const getUserTrackHighlighterLabel = ({ chunk }: HighlighterCallbackFnArgs) => {
  return chunk.props?.id || null
}

const hasUniqueChunks = (segments: TrackSegment[]) => {
  return segments?.[0]?.some((segment) => segment.id)
}

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

  return timebarGraph === 'speed' || timebarGraph === 'elevation'
    ? vesselTracksLayers
    : timebarTracksLayers
}

const vesselTracksAtom = atom<VesselTrackAtom | undefined>(undefined)
export const useTimebarVesselTracksData = () => {
  return useAtomValue(vesselTracksAtom)
}

type VesselTrackAtom = TimebarChartData<any>
export const useTimebarVesselTracks = () => {
  const { timebarVisualisation } = useTimebarVisualisationConnect()
  const timebarGraph = useSelector(selectTimebarGraph)
  const [tracks, setVesselTracks] = useAtom(vesselTracksAtom)

  const trackLayers = useTimebarLayers()
  const tracksLoaded = useMemo(
    () =>
      trackLayers
        .flatMap((v) => {
          const loaded =
            v.instance instanceof VesselLayer
              ? v.instance.getVesselTracksLayersLoaded()
              : v.instance.isLoaded
          return loaded ? v.id : []
        })
        .join(','),
    [trackLayers]
  )
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

  useEffect(() => {
    if (!trackLayers?.length || timebarVisualisation !== TimebarVisualisations.Vessel) {
      return
    }
    setVesselTracks((tracks) => {
      if (!tracks?.length) {
        return tracks
      }
      return tracks.map((track, index) => {
        if (!trackLayers[index]) {
          return track
        }
        const color = trackLayers[index]?.instance?.getColor()
        return {
          ...track,
          color,
          chunks: track.chunks.map((chunk) => {
            return {
              ...chunk,
              color,
            }
          }),
        }
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracksColorHash, timebarVisualisation])

  useEffect(() => {
    requestAnimationFrame(() => {
      if (trackLayers?.length && timebarVisualisation === TimebarVisualisations.Vessel) {
        const vesselTracks = trackLayers.flatMap(({ instance }) => {
          const loaded =
            instance instanceof VesselLayer
              ? instance.getVesselTracksLayersLoaded()
              : instance.isLoaded
          const status = loaded ? ResourceStatus.Finished : ResourceStatus.Loading

          const segments =
            instance instanceof VesselLayer
              ? instance.getVesselTrackSegments()
              : instance.getSegments()

          const trackGraphData: TimebarChartItem<{ color: string }> = {
            id: instance.id,
            color: instance.getColor(),
            chunks: [] as TimebarChartChunk<{ color: string }>[],
            status,
            props: {
              segmentsOffsetY: instance instanceof UserTracksLayer && hasUniqueChunks(segments),
            },
            getHighlighterLabel: getUserTrackHighlighterLabel,
            getHighlighterIcon: 'vessel',
          }

          if (segments?.length && status === ResourceStatus.Finished) {
            trackGraphData.chunks = segments?.map((segment) => {
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
      } else {
        setVesselTracks(undefined)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracksLoaded, timebarGraph, tracksColorHash, timebarVisualisation])

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
  const activeVesselDataviews = useSelector(selectActiveVesselsDataviews)
  const [tracksGraph, setVesselTracksGraph] = useAtom(vesselTracksGraphAtom)
  const trackLayers = useTimebarLayers()

  const tracksLoaded = useMemo(
    () =>
      trackLayers
        .flatMap((v) => {
          return v.instance instanceof VesselLayer
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
          const loaded =
            instance instanceof VesselLayer
              ? instance.getVesselTracksLayersLoaded()
              : instance.isLoaded
          const status = loaded ? ResourceStatus.Finished : ResourceStatus.Loading
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
              ...(instance instanceof VesselLayer ? instance.getFilters() : {}),
            },
          }

          const segments =
            instance instanceof VesselLayer
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
        instance instanceof VesselLayer ? Object.values(instance.getFilters()).filter(Boolean) : [],
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
        const filters =
          trackLayerInstance instanceof VesselLayer ? trackLayerInstance.getFilters() : {}
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

const getTrackEventHighlighterLabel = ({ chunk, expanded }: HighlighterCallbackFnArgs): string => {
  const { description, descriptionGeneric } = getEventDescription(chunk as any)
  if (chunk.cluster) {
    return `${descriptionGeneric} (${chunk.cluster.numChunks} ${t('event.events')})`
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
  const [timebarVesselEvents, setTimebarVesselEvents] =
    useState<TimebarChartData<TrackEventChunkProps> | null>(null)
  const vessels = useTimebarLayers()
  const vesselsWithEventsLoaded = useMemo(
    () => vessels.flatMap((v) => (v.loaded ? v.id : [])).join(','),
    [vessels]
  )
  const eventsColor = useMemo(
    () => vessels.flatMap((v) => v.instance.getColor()).join(','),
    [vessels]
  )

  useEffect(() => {
    requestAnimationFrame(() => {
      if (
        vessels?.length &&
        vesselsWithEventsLoaded.length &&
        visibleEvents?.length &&
        timebarVisualisation === TimebarVisualisations.Vessel
      ) {
        const vesselEvents: TimebarChartData<any> = vessels.map(({ instance }) => {
          const isVesselLayer = instance instanceof VesselLayer
          const loaded = isVesselLayer ? instance.getVesselTracksLayersLoaded() : instance.isLoaded
          const status = loaded ? ResourceStatus.Finished : ResourceStatus.Loading
          return {
            id: instance.id,
            color: instance.getColor(),
            chunks:
              status === ResourceStatus.Finished
                ? isVesselLayer
                  ? instance.getVesselEventsData(visibleEvents)
                  : []
                : [],
            status,
            defaultLabel: isVesselLayer ? instance.getVesselName() : '',
            getHighlighterLabel: getTrackEventHighlighterLabel,
            getHighlighterIcon: 'vessel',
          } as TimebarChartItem<any>
        })
        setTimebarVesselEvents(vesselEvents)
      } else {
        setTimebarVesselEvents(null)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vesselsWithEventsLoaded, timebarGraph, visibleEvents, eventsColor, timebarVisualisation])

  return timebarVesselEvents
}
