import type { ApiEvent } from '@globalfishingwatch/api-types'

import type { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'

const TUNA_RFMO_AREAS = ['CCSBT', 'IATTC', 'ICCAT', 'IOTC', 'NPFC', 'SPRFMO', 'WCPFC']

export const removeNonTunaRFMO = (event: ActivityEvent | ApiEvent): ActivityEvent | ApiEvent => {
  if (!event.regions?.rfmo.length) return event
  return {
    ...event,
    regions: {
      ...event.regions,
      rfmo: event.regions.rfmo.filter((rfmo) => TUNA_RFMO_AREAS.includes(rfmo)),
    },
  }
}
