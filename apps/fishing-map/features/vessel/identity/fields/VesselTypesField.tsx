import { SelfReportedSource, VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'

import type { VesselLastIdentity } from 'features/search/search.slice'
import VesselIdentityField from 'features/vessel/identity/fields/VesselIdentityField'
import { formatInfoField } from 'utils/info'

import VesselIdentityCombinedSourceField from './VesselIdentityCombinedSourceField'

interface VesselTypesFieldProps {
  vesselIdentity: VesselLastIdentity
  fieldKey: 'shiptypes' | 'geartypes'
  identitySource: VesselIdentitySourceEnum
}

const VesselTypesField = ({ vesselIdentity, fieldKey, identitySource }: VesselTypesFieldProps) => {
  if (
    identitySource === VesselIdentitySourceEnum.Registry ||
    vesselIdentity.sourceCode?.includes(SelfReportedSource.Brazil)
  ) {
    return (
      <VesselIdentityField
        value={formatInfoField(vesselIdentity?.[fieldKey], fieldKey) as string}
      />
    )
  }
  if (vesselIdentity.combinedSourcesInfo) {
    return <VesselIdentityCombinedSourceField identity={vesselIdentity} property={fieldKey} />
  }
  return (
    <VesselIdentityField value={formatInfoField(vesselIdentity[fieldKey], fieldKey) as string} />
  )
}

export default VesselTypesField
