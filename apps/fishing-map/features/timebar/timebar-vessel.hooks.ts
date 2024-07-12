import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { atom, useAtom, useAtomValue } from 'jotai'
import { ResourceStatus } from '@globalfishingwatch/api-types'
import {
  HighlighterCallbackFnArgs,
  TimebarChartChunk,
  TimebarChartData,
  TimebarChartItem,
  TrackEventChunkProps,
} from '@globalfishingwatch/timebar'
import { useGetDeckLayers } from '@globalfishingwatch/deck-layer-composer'
import { VesselLayer } from '@globalfishingwatch/deck-layers'
import { selectActiveVesselsDataviews } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { getEventDescription } from 'utils/events'
import { t } from 'features/i18n/i18n'
import { selectTimebarGraph } from 'features/app/selectors/app.timebar.selectors'
import { selectWorkspaceVisibleEventsArray } from 'features/workspace/workspace.selectors'
import { TimebarGraphs } from 'types'

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

const useTimebarVesselsLayers = () => {
  const dataviews = useSelector(selectActiveVesselsDataviews)
  const ids = useMemo(() => {
    return dataviews.map((d) => d.id)
  }, [dataviews])
  const vessels = useGetDeckLayers<VesselLayer>(ids)
  return vessels
}

export const useTimebarVesselTracksData = () => {
  return useAtomValue(vesselTracksAtom)
}

type VesselTrackAtom = TimebarChartData<any>
const vesselTracksAtom = atom<VesselTrackAtom | undefined>(undefined)
export const useTimebarVesselTracks = () => {
  const timebarGraph = useSelector(selectTimebarGraph)
  const [tracks, setVesselTracks] = useAtom(vesselTracksAtom)
  const vessels = useTimebarVesselsLayers()

  const tracksLoaded = useMemo(
    () => vessels.flatMap((v) => (v.instance.getVesselTracksLayersLoaded() ? v.id : [])).join(','),
    [vessels]
  )
  const tracksColor = useMemo(
    () => vessels.flatMap((v) => v.instance.props.color.join('-')).join(','),
    [vessels]
  )

  useEffect(() => {
    if (!vessels?.length) {
      return
    }
    setVesselTracks((tracks) => {
      if (!tracks?.length) {
        return tracks
      }
      return tracks.map((track, index) => {
        if (!vessels[index]) {
          return track
        }
        return {
          ...track,
          color: vessels[index]?.instance?.getVesselColor(),
        }
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracksColor])

  useEffect(() => {
    requestAnimationFrame(() => {
      if (vessels?.length) {
        const vesselTracks = vessels.flatMap(({ instance }) => {
          const status = instance.getVesselTracksLayersLoaded()
            ? ResourceStatus.Finished
            : ResourceStatus.Loading
          const trackGraphData: TimebarChartItem<{ color: string }> = {
            color: instance.getVesselColor(),
            chunks: [] as TimebarChartChunk<{ color: string }>[],
            status,
            getHighlighterLabel: getUserTrackHighlighterLabel,
            getHighlighterIcon: 'vessel',
          }
          const segments = instance.getVesselTrackSegments()
          if (segments?.length && status === ResourceStatus.Finished) {
            trackGraphData.chunks = segments?.map((segment) => {
              const start = segment[0]?.timestamp
              const end = segment[segment.length - 1]?.timestamp
              return {
                start,
                end,
                props: { color: instance.getVesselColor() },
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
  const [tracksGraph, setVesselTracksGraph] = useAtom(vesselTracksGraphAtom)
  const vessels = useTimebarVesselsLayers()

  const tracksLoaded = useMemo(
    () => vessels.flatMap((v) => (v.instance.getVesselTracksLayersLoaded() ? v.id : [])).join(','),
    [vessels]
  )
  const tracksColor = useMemo(
    () => vessels.flatMap((v) => v.instance.props.color.join('-')).join(','),
    [vessels]
  )

  useEffect(() => {
    if (!vessels?.length) {
      return
    }
    setVesselTracksGraph((tracks) => {
      if (!tracks?.length) {
        return tracks
      }
      return tracks.map((track, index) => {
        if (!vessels[index]) {
          return track
        }
        return {
          ...track,
          color: vessels[index]?.instance?.getVesselColor(),
        }
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracksColor])

  useEffect(() => {
    requestAnimationFrame(() => {
      const showGraph = timebarGraph === TimebarGraphs.Speed || timebarGraph === TimebarGraphs.Depth
      if (showGraph && vessels?.length) {
        const vesselTracks = vessels.flatMap(({ instance }) => {
          const status = instance.getVesselTracksLayersLoaded()
            ? ResourceStatus.Finished
            : ResourceStatus.Loading
          const trackGraphData: TimebarChartItem = {
            color: instance.getVesselColor(),
            chunks: [] as TimebarChartChunk[],
            status,
            getHighlighterLabel:
              timebarGraph === TimebarGraphs.Speed
                ? getTrackGraphSpeedHighlighterLabel
                : getTrackGraphElevationighlighterLabel,
            getHighlighterIcon: 'vessel',
          }
          const segments = instance.getVesselTrackSegments({ includeMiddlePoints: true })
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
  }, [tracksLoaded, timebarGraph, vessels])

  return tracksGraph
}

export const useTimebarVesselEvents = () => {
  const timebarGraph = useSelector(selectTimebarGraph)
  const visibleEvents = useSelector(selectWorkspaceVisibleEventsArray)
  const [timebarVesselEvents, setTimebarVesselEvents] =
    useState<TimebarChartData<TrackEventChunkProps> | null>(null)
  const vessels = useTimebarVesselsLayers()
  const eventsLoaded = useMemo(
    () => vessels.flatMap((v) => (v.instance.getVesselEventsLayersLoaded() ? v.id : [])).join(','),
    [vessels]
  )
  const eventsColor = useMemo(
    () => vessels.flatMap((v) => v.instance.props.color.join('-')).join(','),
    [vessels]
  )

  useEffect(() => {
    requestAnimationFrame(() => {
      if (vessels?.length) {
        const vesselEvents: TimebarChartData<any> = vessels.map(({ instance }) => {
          const status = instance.getVesselTracksLayersLoaded()
            ? ResourceStatus.Finished
            : ResourceStatus.Loading
          return {
            color: instance.getVesselColor(),
            chunks:
              status === ResourceStatus.Finished ? instance.getVesselEventsData(visibleEvents) : [],
            status,
            defaultLabel: instance.getVesselName(),
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
  }, [eventsLoaded, timebarGraph, visibleEvents, eventsColor])

  return timebarVesselEvents
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
