import { VesselLastIdentity } from 'features/search/search.slice'
import { getCombinedSourceProperty } from 'features/vessel/vessel.utils'
import VesselIdentityField from 'features/vessel/identity/VesselIdentityField'
import { formatInfoField } from 'utils/info'
import styles from './VesselIdentity.module.css'

type VesselIdentityCombinedSourceFieldProps = {
  identity: VesselLastIdentity
  property: 'geartype' | 'shiptype'
}
const VesselIdentityCombinedSourceField = ({
  identity,
  property,
}: VesselIdentityCombinedSourceFieldProps) => {
  const sourceKey = getCombinedSourceProperty(property)
  const combinedSource = identity?.combinedSourcesInfo?.[sourceKey]
  if (!combinedSource) {
    return identity[property] ? (
      <VesselIdentityField
        value={formatInfoField(identity[property] as string, property) as string}
      />
    ) : null
  }
  return (
    <ul>
      {combinedSource.map((source, index) => {
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
