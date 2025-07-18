import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'

import type { VesselLastIdentity } from 'features/search/search.slice'
import { formatInfoField } from 'utils/info'

import VesselIdentityCombinedSourceField from './VesselIdentityCombinedSourceField'
import VesselIdentityField from './VesselIdentityField'

interface VesselTypesFieldProps {
  vesselIdentity: VesselLastIdentity
  fieldKey: 'shiptypes' | 'geartypes'
  identitySource: VesselIdentitySourceEnum
}

const VesselTypesField = ({ vesselIdentity, fieldKey, identitySource }: VesselTypesFieldProps) => {
  if (vesselIdentity.combinedSourcesInfo) {
    return <VesselIdentityCombinedSourceField identity={vesselIdentity} property={fieldKey} />
  }
  if (identitySource === VesselIdentitySourceEnum.Registry) {
    return (
      <VesselIdentityField
        value={formatInfoField(vesselIdentity?.[fieldKey], fieldKey) as string}
      />
    )
  }
  return (
    <VesselIdentityField value={formatInfoField(vesselIdentity[fieldKey], fieldKey) as string} />
  )
}

export default VesselTypesField
