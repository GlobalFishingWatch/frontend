import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { ResourceStatus } from '@globalfishingwatch/api-types'
import {
  HighlighterCallbackFnArgs,
  TimebarChartData,
  TrackEventChunkProps,
} from '@globalfishingwatch/timebar'
import { useGetDeckLayers } from '@globalfishingwatch/deck-layer-composer'
import { VesselLayer } from '@globalfishingwatch/deck-layers'
import { selectActiveVesselsDataviews } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { getEventDescription } from 'utils/events'
import { t } from 'features/i18n/i18n'
import { selectTimebarGraph } from 'features/app/selectors/app.timebar.selectors'
import { selectWorkspaceVisibleEventsArray } from 'features/workspace/workspace.selectors'

const getUserTrackHighlighterLabel = ({ chunk }: HighlighterCallbackFnArgs) => {
  return chunk.props?.id || null
}

export const useTimebarVesselsLayers = () => {
  const dataviews = useSelector(selectActiveVesselsDataviews)
  const ids = useMemo(() => {
    return dataviews.map((d) => d.id)
  }, [dataviews])
  const vessels = useGetDeckLayers<VesselLayer>(ids)
  return vessels
}

export const useTimebarVesselTracks = () => {
  const timebarGraph = useSelector(selectTimebarGraph)
  const visibleEvents = useSelector(selectWorkspaceVisibleEventsArray)
  const [tracks, setVesselTracks] = useState<TimebarChartData<any> | null>(null)
  const [events, setVesselEvents] = useState<TimebarChartData<TrackEventChunkProps> | null>(null)
  const vessels = useTimebarVesselsLayers()
  const tracksLoaded = useMemo(
    () => vessels.flatMap((v) => (v.instance.getVesselTracksLayersLoaded() ? v.id : [])).join(','),
    [vessels]
  )
  const eventsLoaded = useMemo(
    () => vessels.flatMap((v) => (v.instance.getVesselEventsLayersLoaded() ? v.id : [])).join(','),
    [vessels]
  )
  // const tracksMemoHash = getVesselTimebarTrackMemoHash(vessels)

  useEffect(() => {
    requestAnimationFrame(() => {
      if (vessels?.length) {
        const vesselTracks = vessels.flatMap(({ instance }) => {
          const segments = instance.getVesselTrackSegments()
          const chunks = segments?.map((t) => {
            const start = t[0]?.timestamp
            const end = t[t.length - 1]?.timestamp
            return {
              start,
              end,
              props: { color: instance.getVesselColor() },
              values: t,
            }
          })
          return {
            status: ResourceStatus.Finished,
            chunks,
            color: instance.getVesselColor(),
            defaultLabel: instance.getVesselName() || '',
            getHighlighterLabel: getUserTrackHighlighterLabel,
            getHighlighterIcon: 'vessel',
          }
        })
        setVesselTracks(vesselTracks as any)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracksLoaded, timebarGraph])

  useEffect(() => {
    requestAnimationFrame(() => {
      if (vessels?.length) {
        const vesselEvents: TimebarChartData<any> = vessels.map(({ instance }) => {
          const chunks = instance.getVesselEventsData(visibleEvents) as any
          return {
            color: instance.getVesselColor(),
            chunks,
            // TODO vessel status
            status: instance.dataStatus.find((s) => s.type === 'track')?.status,
            defaultLabel: instance.getVesselName(),
            getHighlighterLabel: getTrackEventHighlighterLabel,
            getHighlighterIcon: 'vessel',
          }
        })
        setVesselEvents(vesselEvents)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventsLoaded, timebarGraph, visibleEvents])

  return { events, tracks }
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
