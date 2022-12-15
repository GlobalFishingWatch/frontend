import { useMemo } from 'react'
import {
  useVesselsLayerInstance,
  useVesselsLayerLoaded,
  useVesselsLayerIds,
} from 'layers/vessel/vessels.hooks'
import { TimebarTracks, TimebarChartChunk, TimebarChartValue } from '@globalfishingwatch/timebar'
import { ResourceStatus } from '@globalfishingwatch/api-types'

const TimebarVesselsEvents = () => {
  const vesselsLayerInstance = useVesselsLayerInstance()
  const vesselsLayerLoaded = useVesselsLayerLoaded()
  const ids = useVesselsLayerIds()

  const getTrackChunk = (segment): TimebarChartChunk => {
    const { waypoints } = segment
    return {
      start: waypoints[0].timestamp || Number.POSITIVE_INFINITY,
      end: waypoints[waypoints.length - 1].timestamp || Number.NEGATIVE_INFINITY,
      values: waypoints as TimebarChartValue[],
    }
  }

  const tracksData = useMemo(() => {
    if (vesselsLayerLoaded) {
      return vesselsLayerInstance
        .getVesselsLayers()
        .filter((l) => ids.includes(l.id))
        .reduce((acc, l) => {
          return [
            ...acc,
            {
              status: ResourceStatus.Finished,
              chunks: l.getVesselTrackData().map((segment) => getTrackChunk(segment)),
              color: '#f00',
            },
          ]
        }, [])
    }
    return []
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vesselsLayerLoaded, ids])

  return <TimebarTracks data={tracksData} />
}

export default TimebarVesselsEvents
