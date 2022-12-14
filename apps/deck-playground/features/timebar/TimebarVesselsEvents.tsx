import { useMemo } from 'react'
import { useVesselsLayerInstance, useVesselsLayerLoaded } from 'layers/vessel/vessels.hooks'
import { TimebarTracksEvents } from '@globalfishingwatch/timebar'
import { useViewport } from 'features/map/map-viewport.hooks'

const TimebarVesselsEvents = () => {
  const vesselsLayerInstance = useVesselsLayerInstance()
  const vesselsLayerLoaded = useVesselsLayerLoaded()
  const { setMapCoordinates } = useViewport()

  const eventsData = useMemo(() => {
    if (vesselsLayerLoaded && vesselsLayerInstance) {
      const vesselsEvents = vesselsLayerInstance.getVesselsLayers().reduce((acc, l) => {
        return [...acc, { chunks: l.getVesselEventsData(), color: '#f00' }]
      }, [])
      return vesselsEvents
    }
    return []
  }, [vesselsLayerLoaded, vesselsLayerInstance])

  const handleEventClick = (e) => {
    const { coordinates } = e
    const [longitude, latitude] = coordinates
    setMapCoordinates({ latitude, longitude, zoom: 9 })
  }

  return <TimebarTracksEvents data={eventsData} onEventClick={handleEventClick} />
}

export default TimebarVesselsEvents
