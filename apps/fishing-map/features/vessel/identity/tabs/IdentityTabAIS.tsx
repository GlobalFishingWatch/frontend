import { useSelector } from 'react-redux'

import { AIS_IDENTITY_LAYOUT } from 'features/vessel/identity/vessel-identity.config'
import { selectVesselInfoData } from 'features/vessel/selectors/vessel.selectors'
import {
  selectVesselIdentityId,
  selectVesselIdentitySource,
} from 'features/vessel/vessel.config.selectors'
import { getCurrentIdentityVessel } from 'features/vessel/vessel.utils'

import VesselIdentityFields from '../fields/VesselIdentityFields'

const AISIdentityTab = () => {
  const vesselData = useSelector(selectVesselInfoData)
  const identityId = useSelector(selectVesselIdentityId)
  const identitySource = useSelector(selectVesselIdentitySource)

  const vesselIdentity = getCurrentIdentityVessel(vesselData, { identityId, identitySource })

  return AIS_IDENTITY_LAYOUT.map((section) => {
    if (section.type === 'fields') {
      return (
        <VesselIdentityFields
          key={section.key}
          fields={section.fields}
          label={section.sectionLabel}
          terminologyKey={section.terminologyKey}
          vesselIdentity={vesselIdentity}
          identitySource={identitySource}
        />
      )
    }
    return null
  })
}

export default AISIdentityTab
