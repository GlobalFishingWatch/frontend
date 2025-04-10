import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { useGetDeckLayer } from '@globalfishingwatch/deck-layer-composer'
import type { VesselLayer } from '@globalfishingwatch/deck-layers'

import { VESSEL_LAYER_PREFIX } from 'features/dataviews/dataviews.utils'
import { selectVesselInfoData } from 'features/vessel/selectors/vessel.selectors'
import { selectVesselSelfReportedId } from 'features/vessel/vessel.config.selectors'
import { getVesselProperty } from 'features/vessel/vessel.utils'
import { useVisibleVesselEvents } from 'features/workspace/vessels/vessel-events.hooks'
import { selectVesselId } from 'routes/routes.selectors'

export const useVesselProfileLayer = () => {
  const vesselId = useSelector(selectVesselId)
  const vesselLayer = useGetDeckLayer<VesselLayer>(`${VESSEL_LAYER_PREFIX}${vesselId}`)
  return vesselLayer
}

export const useUpdateVesselEventsVisibility = () => {
  const { setVesselEventVisibility } = useVisibleVesselEvents()
  const vessel = useSelector(selectVesselInfoData)
  const identityId = useSelector(selectVesselSelfReportedId)
  useEffect(() => {
    if (vessel) {
      const shiptypes = getVesselProperty(vessel, 'shiptypes', {
        identityId,
        identitySource: VesselIdentitySourceEnum.SelfReported,
      })
      if (shiptypes?.includes('FISHING')) {
        setVesselEventVisibility({ event: 'loitering', visible: false })
      } else {
        setVesselEventVisibility({ event: 'fishing', visible: false })
      }
    }
  }, [vessel])
}
