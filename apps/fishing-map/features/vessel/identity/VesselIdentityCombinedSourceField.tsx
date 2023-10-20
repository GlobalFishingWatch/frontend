import { VesselLastIdentity } from 'features/search/search.slice'
import { getCombinedSourceProperty } from 'features/vessel/vessel.utils'
import VesselIdentityField from 'features/vessel/identity/VesselIdentityField'
import { formatInfoField } from 'utils/info'
import styles from './VesselIdentity.module.css'

type VesselIdentityCombinedSourceFieldProps = {
  identity: VesselLastIdentity
  key: 'geartype' | 'shiptype'
}
const VesselIdentityCombinedSourceField = ({
  identity,
  key,
}: VesselIdentityCombinedSourceFieldProps) => {
  const sourceKey = getCombinedSourceProperty(key)
  const combinedSource = identity?.combinedSourcesInfo?.[sourceKey]
  if (!combinedSource) {
    return identity[key] ? (
      <VesselIdentityField value={formatInfoField(identity[key] as string, key) as string} />
    ) : null
  }
  return (
    <ul>
      {combinedSource.map((source, index) => {
        const { name, yearTo, yearFrom } = source
        const dates = yearTo === yearFrom ? yearTo : `${yearFrom} - ${yearTo}`
        return (
          <li key={index}>
            <VesselIdentityField value={formatInfoField(name, key) as string} />{' '}
            <span className={styles.secondary}>({dates})</span>
          </li>
        )
      })}
    </ul>
  )
}

export default VesselIdentityCombinedSourceField
