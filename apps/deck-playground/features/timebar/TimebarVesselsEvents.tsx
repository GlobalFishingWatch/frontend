import { useMemo } from 'react'
import { useVesselsLayerInstance, useVesselsLayerLoaded } from 'layers/vessel/vessels.hooks'
import { TimebarTracksEvents } from '@globalfishingwatch/timebar'

const TimebarVesselsEvents = () => {
  const vesselsLayerInstance = useVesselsLayerInstance()
  const vesselsLayerLoaded = useVesselsLayerLoaded()

  const eventsData = useMemo(() => {
    if (vesselsLayerLoaded && vesselsLayerInstance) {
      const vesselsEvents = vesselsLayerInstance.getVesselsLayers().reduce((acc, l) => {
        return [...acc, { chunks: l.getVesselEventsData(), color: '#f00' }]
      }, [])
      return vesselsEvents
    }
    return []
  }, [vesselsLayerLoaded, vesselsLayerInstance])

  return <TimebarTracksEvents data={eventsData} onEventClick={(e) => console.log(e)} />
}

export default TimebarVesselsEvents
