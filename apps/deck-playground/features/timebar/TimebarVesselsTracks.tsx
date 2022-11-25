import { useMemo } from 'react'
import { useVesselsLayerInstance, useVesselsLayerLoaded } from 'layers/vessel/vessels.hooks'
import { TimebarTracks, TimebarChartChunk, TimebarChartValue } from '@globalfishingwatch/timebar'
import { ResourceStatus } from '../../../../libs/api-types/src/resources'

const TimebarVesselsEvents = () => {
  const vesselsLayerInstance = useVesselsLayerInstance()
  const vesselsLayerLoaded = useVesselsLayerLoaded()

  const getTrackChunks = (segments): TimebarChartChunk[] => {
    return segments.map((segment) => {
      const { waypoints } = segment
      return {
        start: waypoints[0].timestamp || Number.POSITIVE_INFINITY,
        end: waypoints[waypoints.length - 1].timestamp || Number.NEGATIVE_INFINITY,
        values: waypoints as TimebarChartValue[],
        props: {
          id: waypoints[0]?.id,
          color: waypoints[0]?.color ? waypoints[0]?.color : undefined,
        },
      }
    })
  }

  const tracksData = useMemo(() => {
    if (vesselsLayerLoaded && vesselsLayerInstance) {
      return vesselsLayerInstance
        .getVesselsLayers()
        .map((l) => l.getVesselTrackData())
        .map((segments) => ({
          status: ResourceStatus.Finished,
          chunks: getTrackChunks(segments),
          color: '#f00',
        }))
    }
    return []
  }, [vesselsLayerLoaded, vesselsLayerInstance])

  return <TimebarTracks data={tracksData} />
}

export default TimebarVesselsEvents
