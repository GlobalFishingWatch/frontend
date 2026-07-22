import { useSelector } from 'react-redux'
import cx from 'classnames'

import { Tooltip } from '@globalfishingwatch/ui-components'

import type { VesselLastIdentity } from 'features/search/search.slice'
import GFWOnly from 'features/user/GFWOnly'
import { selectIsGFWUser, selectIsJACUser } from 'features/user/selectors/user.selectors'
import { getIsCombinedSourceInTimerange } from 'features/vessel/identity/fields/vessel-identity.utils'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from 'utils/info'

import styles from '../VesselIdentity.module.css'

type VesselIdentityGFWExtendedGeartypeProps = {
  identity: VesselLastIdentity
  sourceIndex: number
}
const VesselIdentityGFWExtendedGeartype = ({
  identity,
  sourceIndex,
}: VesselIdentityGFWExtendedGeartypeProps) => {
  const isGFWUser = useSelector(selectIsGFWUser)
  const isJACUser = useSelector(selectIsJACUser)

  if ((!isGFWUser && !isJACUser) || !identity.combinedSourcesInfo) {
    return null
  }
  const {
    geartypes,
    prodGeartypeSource = [],
    inferredVesselClassAgNnet = [],
    registryVesselClass = [],
  } = identity.combinedSourcesInfo

  const inferredVesselClassAgNnetInTimerange = inferredVesselClassAgNnet.find((source) =>
    getIsCombinedSourceInTimerange(identity, source)
  )
  const registryVesselClassInTimerange = registryVesselClass.find((source) =>
    getIsCombinedSourceInTimerange(identity, source)
  )
  const prodGeartypeSourceInTimerange = prodGeartypeSource.find((source) =>
    getIsCombinedSourceInTimerange(identity, source)
  )
  return (
    <ul className={styles.extendedInfo}>
      <li>
        <GFWOnly userGroup="gfw" className={styles.gfwOnly} />
      </li>
      {/* pipe5 missing API properties: rf_atomic_class, rf_vessel_class_score, vessel_class_source_agreement */}
      <li>
        <Tooltip content="(inferredVesselClassAgNnet) Vessel class inferred by the machine learning model.">
          <span className={cx(styles.secondary, styles.help)}>ML vessel class: </span>
        </Tooltip>
        {inferredVesselClassAgNnetInTimerange?.value
          ? formatInfoField(inferredVesselClassAgNnetInTimerange?.value as string, 'geartypes')
          : EMPTY_FIELD_PLACEHOLDER}
      </li>
      <li>
        <Tooltip content='(registryVesselClass) Data pulled from the vi_ssvid table — an MMSI-based aggregate from available registries. This is for comparison with the "Registry" tab gear, which aggregates at the hull level.'>
          <span className={cx(styles.secondary, styles.help)}>Aggregated registry: </span>
        </Tooltip>
        {registryVesselClassInTimerange?.value
          ? (formatInfoField(registryVesselClassInTimerange.value as string, 'geartypes') as string)
          : EMPTY_FIELD_PLACEHOLDER}
      </li>
      <li>
        <Tooltip content="(prodGeartypeSource) Data table and specific field the GFW gear type value is populated from">
          <span className={cx(styles.secondary, styles.help)}>BQ Source: </span>
        </Tooltip>
        {(prodGeartypeSourceInTimerange?.value as string)?.toLowerCase() || EMPTY_FIELD_PLACEHOLDER}
      </li>
      <li>
        <Tooltip content="(geartype)">
          <span className={cx(styles.secondary, styles.help)}>Random Forest estimate: </span>
        </Tooltip>
        {geartypes?.[sourceIndex]?.name
          ? (formatInfoField(geartypes?.[sourceIndex]?.name as string, 'geartypes') as string)
          : EMPTY_FIELD_PLACEHOLDER}
      </li>
    </ul>
  )
}

export default VesselIdentityGFWExtendedGeartype
