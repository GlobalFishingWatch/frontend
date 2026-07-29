import { useSelector } from 'react-redux'
import cx from 'classnames'

import { Tooltip } from '@globalfishingwatch/ui-components'

import GFWOnly from 'features/user/GFWOnly'
import { selectIsGFWUser, selectIsJACUser } from 'features/user/selectors/user.selectors'
import type { VesselLastIdentity } from 'features/vessels/search/search.slice'
import { getIsCombinedSourceInTimerange } from 'features/vessels/vessel/identity/fields/vessel-identity.utils'
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
    atomicClass = [],
    vesselClassScore = [],
    bestVesselClassRf = [],
    prodGeartypeSource = [],
    inferredVesselClassAgNnet = [],
    registryVesselClass = [],
    vesselClassSourceAgreement = [],
  } = identity.combinedSourcesInfo

  const atomicClassInTimerange = atomicClass.find((source) =>
    getIsCombinedSourceInTimerange(identity, source)
  )
  const inferredVesselClassAgNnetInTimerange = inferredVesselClassAgNnet.find((source) =>
    getIsCombinedSourceInTimerange(identity, source)
  )
  const registryVesselClassInTimerange = registryVesselClass.find((source) =>
    getIsCombinedSourceInTimerange(identity, source)
  )
  const prodGeartypeSourceInTimerange = prodGeartypeSource.find((source) =>
    getIsCombinedSourceInTimerange(identity, source)
  )
  const vesselClassScoreInTimerange = vesselClassScore.find((source) =>
    getIsCombinedSourceInTimerange(identity, source)
  )
  const vesselClassSourceAgreementInTimerange = vesselClassSourceAgreement.find((source) =>
    getIsCombinedSourceInTimerange(identity, source)
  )
  return (
    <ul className={styles.extendedInfo}>
      <li>
        <GFWOnly userGroup="gfw" className={styles.gfwOnly} />
      </li>
      <li>
        <Tooltip content="(inferredVesselClassAgNnet) Vessel class inferred by the machine learning model.">
          <span className={cx(styles.secondary, styles.help)}>ML vessel class: </span>
        </Tooltip>
        {inferredVesselClassAgNnetInTimerange?.value
          ? formatInfoField(inferredVesselClassAgNnetInTimerange?.value as string, 'geartypes')
          : EMPTY_FIELD_PLACEHOLDER}
      </li>
      <li>
        <span className={cx(styles.secondary, styles.help)}>ML atomic class: </span>
        {atomicClassInTimerange?.value
          ? formatInfoField(atomicClassInTimerange?.value as string, 'geartypes')
          : EMPTY_FIELD_PLACEHOLDER}
      </li>
      <li>
        <Tooltip content='(registryVesselClass) Data pulled from the vi_ssvid table — an MMSI-based aggregate from available registries. This is for comparison with the "Registry" tab gear, which aggregates at the hull level.'>
          <span className={cx(styles.secondary, styles.help)}>Aggregated registry: </span>
        </Tooltip>
        {registryVesselClassInTimerange?.value
          ? registryVesselClassInTimerange.value
          : EMPTY_FIELD_PLACEHOLDER}
      </li>
      <li>
        <Tooltip content="(prodGeartypeSource) Data table and specific field the GFW gear type value is populated from">
          <span className={cx(styles.secondary, styles.help)}>BQ Source: </span>
        </Tooltip>
        {(prodGeartypeSourceInTimerange?.value as string)?.toLowerCase() || EMPTY_FIELD_PLACEHOLDER}
      </li>
      <li>
        <span className={cx(styles.secondary, styles.help)}>ML vessel class score </span>
        {vesselClassScoreInTimerange?.value !== undefined
          ? vesselClassScoreInTimerange.value
          : EMPTY_FIELD_PLACEHOLDER}
      </li>
      <li>
        <span className={cx(styles.secondary, styles.help)}>Vessel class source agreement: </span>
        {vesselClassSourceAgreementInTimerange?.value
          ? vesselClassSourceAgreementInTimerange.value
          : EMPTY_FIELD_PLACEHOLDER}
      </li>
    </ul>
  )
}

export default VesselIdentityGFWExtendedGeartype
