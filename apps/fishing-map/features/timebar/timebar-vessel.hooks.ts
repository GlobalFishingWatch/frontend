import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { atom, useAtom, useAtomValue } from 'jotai'

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
  selectAllActiveTrackDataviews,
  selectVesselsDataviews,
} from 'features/dataviews/selectors/dataviews.instances.selectors'
import { t } from 'features/i18n/i18n'
import { selectWorkspaceVisibleEventsArray } from 'features/workspace/workspace.selectors'
import { TimebarGraphs } from 'types'
import { getEventDescription } from 'utils/events'

const getUserTrackHighlighterLabel = ({ chunk }: HighlighterCallbackFnArgs) => {
  return chunk.props?.id || null
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
  const dataviews = useSelector(selectAllActiveTrackDataviews)
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
  const tracksColor = useMemo(
    () => trackLayers.flatMap((v) => v.instance.getColor() || []).join(','),
    [trackLayers]
  )

  useEffect(() => {
    if (!trackLayers?.length) {
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
        return {
          ...track,
          color: trackLayers[index]?.instance?.getColor(),
        }
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracksColor])

  useEffect(() => {
    requestAnimationFrame(() => {
      if (trackLayers?.length) {
        const vesselTracks = trackLayers.flatMap(({ instance }) => {
          const loaded =
            instance instanceof VesselLayer
              ? instance.getVesselTracksLayersLoaded()
              : instance.isLoaded
          const status = loaded ? ResourceStatus.Finished : ResourceStatus.Loading
          const trackGraphData: TimebarChartItem<{ color: string }> = {
            id: instance.id,
            color: instance.getColor(),
            chunks: [] as TimebarChartChunk<{ color: string }>[],
            status,
            props: { segmentsOffsetY: instance instanceof UserTracksLayer },
            getHighlighterLabel: getUserTrackHighlighterLabel,
            getHighlighterIcon: 'vessel',
          }
          const segments =
            instance instanceof VesselLayer
              ? instance.getVesselTrackSegments()
              : instance.getSegments()

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
  }, [tracksLoaded, timebarGraph, tracksColor])

  return tracks
}

const vesselTracksGraphAtom = atom<VesselTrackAtom | undefined>(undefined)

const getTrackGraphSpeedHighlighterLabel = ({ value }: HighlighterCallbackFnArgs) =>
  value ? `${value.value?.toFixed(2)} knots` : ''
const getTrackGraphElevationighlighterLabel = ({ value }: HighlighterCallbackFnArgs) =>
  value ? `${value.value} m` : ''

export const useTimebarVesselTracksGraph = () => {
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
    if (!trackLayers?.length) {
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
  }, [tracksColor])

  useEffect(() => {
    requestAnimationFrame(() => {
      const showGraph = timebarGraph === TimebarGraphs.Speed || timebarGraph === TimebarGraphs.Depth
      if (showGraph && trackLayers?.length) {
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
  }, [tracksLoaded, timebarGraph, tracksGraph])

  const tracksFiltersHash = useMemo(() => {
    return activeVesselDataviews
      .flatMap((dataview) => [
        (dataview.config?.filters?.speed || []).join(),
        (dataview.config?.filters?.elevation || []).join(),
      ])
      .join(',')
  }, [activeVesselDataviews])

  useEffect(() => {
    setVesselTracksGraph((tracksGraph) =>
      tracksGraph?.map((graph) => {
        const dataview = activeVesselDataviews.find((dataview) => dataview.id === graph.id)
        if (!dataview) {
          return graph
        }
        const { speed, elevation } = dataview.config?.filters || {}
        return {
          ...graph,
          filters: {
            minSpeedFilter: speed?.[0],
            maxSpeedFilter: speed?.[1],
            minElevationFilter: elevation?.[0],
            maxElevationFilter: elevation?.[1],
          },
        } as TimebarChartItem
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracksFiltersHash])

  // TODO: debug why the trackLayers is updated but the filters not
  // 👀using the workaround above to take the filter from the dataview for now
  // ⚠ but it should be taken from the layer itself as the source of truth

  // const tracksFiltersHash = useMemo(() => {
  //   return trackLayers
  //     .flatMap(({ instance }) => [
  //       instance instanceof VesselLayer ? Object.values(instance.getFilters()) : [],
  //     ])
  //     .join(',')
  // }, [trackLayers])

  // useEffect(() => {
  //   setVesselTracksGraph((tracksGraph) => {
  //     return tracksGraph?.map((graph) => {
  //       const trackLayerInstance = trackLayers.find(
  //         (layer) => layer.instance?.id === graph.id
  //       )?.instance
  //       if (!trackLayerInstance) {
  //         return graph
  //       }
  //       const filters =
  //         trackLayerInstance instanceof VesselLayer ? trackLayerInstance.getFilters() : {}
  //       return {
  //         ...graph,
  //         filters,
  //       } as TimebarChartItem
  //     })
  //   })
  // }, [tracksFiltersHash])

  return tracksGraph
}

const getTrackEventHighlighterLabel = ({ chunk, expanded }: HighlighterCallbackFnArgs): string => {
  const { description, descriptionGeneric } = getEventDescription(chunk as any)
  if (chunk.cluster) {
    return `${descriptionGeneric} (${chunk.cluster.numChunks} ${t('event.events', 'events')})`
  }
  if (expanded) {
    return description as string
  }
  return descriptionGeneric as string
}

export const useTimebarVesselEvents = () => {
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
      if (vessels?.length && vesselsWithEventsLoaded.length && visibleEvents?.length) {
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
  }, [vesselsWithEventsLoaded, timebarGraph, visibleEvents, eventsColor])

  return timebarVesselEvents
}
