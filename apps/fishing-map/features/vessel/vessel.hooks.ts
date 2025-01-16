import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'

import { selectVesselInfoData } from 'features/vessel/selectors/vessel.selectors'
import { selectVesselSelfReportedId } from 'features/vessel/vessel.config.selectors'
import { getVesselProperty } from 'features/vessel/vessel.utils'
import { useVisibleVesselEvents } from 'features/workspace/vessels/vessel-events.hooks'

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
