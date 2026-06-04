import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { extent } from 'simple-statistics'

import type { VesselLayer } from '@globalfishingwatch/deck-layers'
import { generateVesselGraphSteps } from '@globalfishingwatch/deck-layers'
import type { VesselTrackGraphExtent } from '@globalfishingwatch/deck-loaders'
import { getVesselGraphExtentClamped } from '@globalfishingwatch/deck-loaders'

import { selectTimebarGraph } from 'features/app/selectors/app.timebar.selectors'
import { useVesselTracksLayers } from 'features/timebar/timebar-vessel.hooks'

export const useTimebarTracksGraphExtent = () => {
  const vesselsTimebarGraph = useSelector(selectTimebarGraph)
  const vessels = useVesselTracksLayers()
  const areAllVesselsLoaded = vessels.every((vessel) => vessel.loaded)
  const vesselsHash = vessels.map((v) => v.id).join()

  return useMemo(() => {
    if (vesselsTimebarGraph === 'none' || !vessels?.length || !areAllVesselsLoaded) {
      return
    }
    const vesselExtents = vessels.flatMap((v) =>
      (v.instance as VesselLayer).getVesselTrackGraphExtent(vesselsTimebarGraph)
    )
    if (!vesselExtents.length) {
      return
    }
    return getVesselGraphExtentClamped(
      extent(vesselExtents),
      vesselsTimebarGraph
    ) as VesselTrackGraphExtent
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areAllVesselsLoaded, vesselsHash, vesselsTimebarGraph])
}

export const useTimebarTracksGraphSteps = () => {
  const extent = useTimebarTracksGraphExtent()
  const vesselsTimebarGraph = useSelector(selectTimebarGraph)
  return useMemo(() => {
    if (
      !extent?.length ||
      (vesselsTimebarGraph !== 'speed' && vesselsTimebarGraph !== 'elevation')
    ) {
      return []
    }
    return generateVesselGraphSteps(extent, vesselsTimebarGraph)
  }, [extent, vesselsTimebarGraph])
}
