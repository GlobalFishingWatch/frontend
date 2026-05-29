import { Fragment } from 'react/jsx-runtime'
import { useSelector } from 'react-redux'

import { selectHasTMTPermission } from 'features/user/selectors/user.permissions.selectors'
import {
  REGISTRY_IDENTITY_LAYOUT,
  REGISTRY_SOURCES,
} from 'features/vessel/identity/vessel-identity.config'
import { selectVesselInfoData } from 'features/vessel/selectors/vessel.selectors'
import {
  selectVesselIdentityId,
  selectVesselIdentitySource,
} from 'features/vessel/vessel.config.selectors'
import { getCurrentIdentityVessel } from 'features/vessel/vessel.utils'

import VesselIdentityFields from '../fields/VesselIdentityFields'
import VesselRegistryContact from '../fields/VesselRegistryContact'
import VesselRegistryField from '../fields/VesselRegistryField'

const RegistryIdentityTab = () => {
  const vesselData = useSelector(selectVesselInfoData)
  const identityId = useSelector(selectVesselIdentityId)
  const identitySource = useSelector(selectVesselIdentitySource)
  const hasTMTPermission = useSelector(selectHasTMTPermission)

  const vesselIdentity = getCurrentIdentityVessel(vesselData, { identityId, identitySource })
  const registrySourceData = REGISTRY_SOURCES.find((s) => s.key === vesselIdentity.registrySource)

  const hasMoreInfo =
    !!vesselIdentity?.hasComplianceInfo ||
    vesselIdentity?.iuuStatus?.value?.toUpperCase() === 'CURRENT'

  return (
    <Fragment>
      {REGISTRY_IDENTITY_LAYOUT.map((section) => {
        if (section.type === 'fields' && section.fields) {
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
        if (section.type === 'registryFields' && section.field) {
          return (
            <VesselRegistryField
              key={section.key}
              registryField={section.field}
              vesselIdentity={vesselIdentity}
            />
          )
        }
        return null
      })}
      {hasTMTPermission && hasMoreInfo && (
        <VesselRegistryContact key="registryContact" registrySource={registrySourceData} />
      )}
    </Fragment>
  )
}

export default RegistryIdentityTab
