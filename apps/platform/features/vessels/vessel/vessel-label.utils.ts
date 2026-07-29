import type { TFunction } from 'i18next'

import type { IdentityVessel } from '@globalfishingwatch/api-types'

import { t } from 'features/i18n/i18n'
import type { ExtendedFeatureVessel } from 'features/map/map/map.slice'
import { getLatestIdentityPrioritised } from 'features/vessels/vessel/vessel.utils'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField, getVesselGearTypeLabel } from 'utils/info'

/**
 * Lives here rather than in `utils/info` because it needs `getLatestIdentityPrioritised`, and
 * `utils/info` is reachable from `routes/__root` via router.meta — i.e. from every page. Importing a
 * feature module from there dragged @globalfishingwatch/deck-layers into the entry chunk of the
 * landing page. Guarded by scripts/check-store-graph.mjs.
 */
export const getVesselShipNameLabel = (
  vessel: ExtendedFeatureVessel | IdentityVessel,
  {
    translationFn = t,
    withGearType = false,
  }: {
    translationFn?: TFunction
    withGearType?: boolean
  } = {}
): string => {
  const vesselInfo = getLatestIdentityPrioritised(vessel)
  if (!vesselInfo) return translationFn((t) => t.common.unknownVessel)
  if (vesselInfo.shipname && vesselInfo.geartypes && vesselInfo.flag && withGearType) {
    const gearTypes = getVesselGearTypeLabel(vesselInfo, { translationFn })
    return `${formatInfoField(vesselInfo.shipname, 'shipname')}
    (${translationFn((t) => t[vesselInfo.flag], { ns: 'flags', defaultValue: vesselInfo.flag })}, ${gearTypes || EMPTY_FIELD_PLACEHOLDER})`
  }
  if (vesselInfo.shipname) {
    return formatInfoField(vesselInfo.shipname, 'shipname', { translationFn }) as string
  }
  if (vesselInfo.geartypes) {
    return `${translationFn((t) => t.vessel.unkwownVesselByGeartype, {
      gearType: getVesselGearTypeLabel({ geartypes: vesselInfo.geartypes }, { translationFn }),
    })}`
  }
  return translationFn((t) => t.common.unknownVessel)
}
