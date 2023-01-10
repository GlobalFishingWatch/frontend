import { useCallback, useMemo } from 'react'
import {
  useVesselsLayerInstance,
  useVesselsLayerLoaded,
  useVesselsLayerIds,
} from 'layers/vessel/vessels.hooks'
import { TimebarTracksEvents } from '@globalfishingwatch/timebar'
import { useViewport } from 'features/map/map-viewport.hooks'

const TimebarVesselsEvents = () => {
  const vesselsLayerInstance = useVesselsLayerInstance()
  const vesselsLayerLoaded = useVesselsLayerLoaded()
  const ids = useVesselsLayerIds()
  const { setMapCoordinates } = useViewport()

  const eventsData = useMemo(() => {
    if (vesselsLayerLoaded) {
      return ids.map(
        id => ({
          chunks: vesselsLayerInstance.getVesselEventsDataById(id),
          color: '#f00' 
      }))
    }
    return []
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vesselsLayerLoaded, ids])

  const handleEventClick = useCallback(
    (e) => {
      const { coordinates } = e
      const [longitude, latitude] = coordinates
      setMapCoordinates({ latitude, longitude, zoom: 9 })
    },
    [setMapCoordinates]
  )

  return <TimebarTracksEvents data={eventsData} onEventClick={handleEventClick} />
}

export default TimebarVesselsEvents
