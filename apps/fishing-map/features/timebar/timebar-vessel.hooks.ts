import { useEffect, useState } from 'react'
import { ResourceStatus } from '@globalfishingwatch/api-types'
import { VesselLayerState, useVesselLayers } from '@globalfishingwatch/deck-layers'
import {
  HighlighterCallbackFnArgs,
  TimebarChartData,
  TrackEventChunkProps,
} from '@globalfishingwatch/timebar'
import { parseTrackEventChunkProps } from 'features/timebar/timebar.utils'
import { t } from 'features/i18n/i18n'

const getUserTrackHighlighterLabel = ({ chunk }: HighlighterCallbackFnArgs) => {
  return chunk.props?.id || null
}

const getVesselTimebarTrackMemoHash = (vessels: VesselLayerState[]) => {
  return vessels
    .flatMap((v) => {
      const visible = v.instance.props.visible
      const dataStatus = v.dataStatus
        .flatMap((s) => (s.type === 'track' && s.status === ResourceStatus.Finished ? s.type : []))
        .join('|')
      return [visible, dataStatus].join('-')
    })
    .join(',')
}

const getVesselTimebarEventsMemoHash = (vessels: VesselLayerState[]) => {
  return vessels
    .flatMap((v) => {
      const visible = v.instance.props.visible
      const visibleEvents = v.instance.props.visibleEvents?.join('|')
      const dataStatus = v.dataStatus
        .flatMap((s) => (s.type !== 'track' && s.status === ResourceStatus.Finished ? s.type : []))
        .join('|')
      return [visible, visibleEvents, dataStatus].join('-')
    })
    .join(',')
}

export const useTimebarVesselTracks = () => {
  const vessels = useVesselLayers()
  const [tracks, setVesselTracks] = useState<TimebarChartData<any> | null>(null)
  const tracksMemoHash = getVesselTimebarTrackMemoHash(vessels)

  useEffect(() => {
    requestAnimationFrame(() => {
      if (vessels?.length) {
        const vesselTracks = vessels.flatMap(({ instance }) => {
          if (!instance.props.visible) {
            return []
          }
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
  }, [tracksMemoHash])
  return tracks
}

const getTrackEventHighlighterLabel = ({ chunk, expanded }: HighlighterCallbackFnArgs): string => {
  const chunkWithProps = parseTrackEventChunkProps(chunk)
  if (chunkWithProps.cluster) {
    return `${chunkWithProps.props?.descriptionGeneric} (${chunkWithProps.cluster.numChunks} ${t(
      'event.events',
      'events'
    )})`
  }
  if (expanded) {
    return chunkWithProps.props?.description as string
  }
  return chunkWithProps.props?.descriptionGeneric as string
}

export const useTimebarVesselEvents = () => {
  const vessels = useVesselLayers()
  const [events, setVesselEvents] = useState<TimebarChartData<TrackEventChunkProps> | null>(null)
  const tracksMemoHash = getVesselTimebarEventsMemoHash(vessels)
  useEffect(() => {
    requestAnimationFrame(() => {
      if (vessels.length) {
        const vesselEvents: TimebarChartData<any> = vessels.flatMap(({ instance, dataStatus }) => {
          if (!instance.props.visible) {
            return []
          }
          const chunks = instance.getVesselEventsData(instance.props.visibleEvents) as any
          return {
            color: instance.getVesselColor(),
            chunks,
            status: dataStatus.find((s) => s.type === 'track')?.status,
            defaultLabel: instance.getVesselName(),
            getHighlighterLabel: getTrackEventHighlighterLabel,
            getHighlighterIcon: 'vessel',
          }
        })
        setVesselEvents(vesselEvents)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracksMemoHash])
  return events
}
