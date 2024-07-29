import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { useGetDeckLayer } from '@globalfishingwatch/deck-layer-composer'
import { VesselLayer } from '@globalfishingwatch/deck-layers'
import { selectVesselProfileDataview } from 'features/dataviews/selectors/dataviews.instances.selectors'

export const useVesselProfileTrack = () => {
  const vesselDataview = useSelector(selectVesselProfileDataview)
  const vesselLayer = useGetDeckLayer<VesselLayer>(vesselDataview?.id as string)
  const trackLoaded = vesselLayer?.instance?.getVesselTracksLayersLoaded()
  return useMemo(() => {
    return vesselLayer?.instance?.getVesselTrackSegments({ includeCoordinates: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackLoaded])
}
