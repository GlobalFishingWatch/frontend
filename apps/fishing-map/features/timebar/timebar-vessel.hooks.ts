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
        const vesselTracks = vessels.flatMap(({ layerInstance }) => {
          if (!layerInstance.props.visible) {
            return []
          }
          const segments = layerInstance.getVesselTrackSegments()
          const chunks = segments?.map((t) => {
            const start = t[0]?.timestamp
            const end = t[t.length - 1]?.timestamp
            return {
              start,
              end,
              props: { color: layerInstance.getVesselColor() },
              values: t,
            }
          })
          return {
            status: ResourceStatus.Finished,
            chunks,
            color: layerInstance.getVesselColor(),
            defaultLabel: layerInstance.getVesselName() || '',
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
        const vesselEvents: TimebarChartData<any> = vessels.flatMap(
          ({ layerInstance, dataStatus }) => {
            if (!layerInstance.props.visible) {
              return []
            }
            const chunks = layerInstance.getVesselEventsData(
              layerInstance.props.visibleEvents
            ) as any
            return {
              color: layerInstance.getVesselColor(),
              chunks,
              status: dataStatus.find((s) => s.type === 'track')?.status,
              defaultLabel: layerInstance.getVesselName(),
              getHighlighterLabel: getTrackEventHighlighterLabel,
              getHighlighterIcon: 'vessel',
            }
          }
        )
        setVesselEvents(vesselEvents)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracksMemoHash])
  return events
}
