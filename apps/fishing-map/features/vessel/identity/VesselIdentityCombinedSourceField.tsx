import type { VesselInfo } from '@globalfishingwatch/api-types'

import type { VesselLastIdentity } from 'features/search/search.slice'
import VesselIdentityField from 'features/vessel/identity/VesselIdentityField'
import { formatInfoField } from 'utils/info'

import styles from './VesselIdentity.module.css'

type VesselIdentityCombinedSourceFieldProps = {
  identity: VesselLastIdentity
  property: keyof Pick<VesselInfo, 'geartypes' | 'shiptypes'>
}
const VesselIdentityCombinedSourceField = ({
  identity,
  property,
}: VesselIdentityCombinedSourceFieldProps) => {
  const combinedSource = identity?.combinedSourcesInfo?.[property]
  if (!combinedSource) {
    return identity[property] ? (
      <VesselIdentityField value={formatInfoField(identity[property], property) as string} />
    ) : null
  }

  return (
    <ul>
      {[...combinedSource]
        .sort((a, b) => (a.yearTo < b.yearTo ? 1 : -1))
        .map((source, index) => {
          const { name, yearTo, yearFrom } = source
          const dates = yearTo === yearFrom ? yearTo : `${yearFrom} - ${yearTo}`
          return (
            <li key={index}>
              <VesselIdentityField value={formatInfoField(name, property) as string} />{' '}
              {combinedSource?.length > 1 && <span className={styles.secondary}>({dates})</span>}
            </li>
          )
        })}
    </ul>
  )
}

export default VesselIdentityCombinedSourceField
