import { useSelector } from 'react-redux'
import cx from 'classnames'

import type { VesselRegistryInfo } from '@globalfishingwatch/api-types'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { Tooltip } from '@globalfishingwatch/ui-components'

import GFWOnly from 'features/_user/GFWOnly'
import { selectIsGFWUser, selectIsJACUser } from 'features/_user/selectors/user.selectors'
import type { VesselLastIdentity } from 'features/_vessels/search/search.slice'
import { getIsCombinedSourceInTimerange } from 'features/_vessels/vessel/identity/fields/vessel-identity.utils'
import { isRegistryInTimerange } from 'features/_vessels/vessel/identity/vessel-identity.utils'
import { selectVesselInfoData } from 'features/_vessels/vessel/selectors/vessel.selectors'
import { selectShowPipe5IdentityFields } from 'features/_vessels/vessel/vessel.config.selectors'
import { getVesselIdentities } from 'features/_vessels/vessel/vessel.utils'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from 'utils/info'

import styles from '../VesselIdentity.module.css'

type VesselIdentityGFWExtendedGeartypeProps = {
  identity: VesselLastIdentity
  sourceIndex: number
}
const VesselIdentityGFWExtendedGeartype = ({
  identity,
}: VesselIdentityGFWExtendedGeartypeProps) => {
  const isGFWUser = useSelector(selectIsGFWUser)
  const isJACUser = useSelector(selectIsJACUser)
  const showPipe5Fields = useSelector(selectShowPipe5IdentityFields)
  const vesselData = useSelector(selectVesselInfoData)

  if ((!isGFWUser && !isJACUser) || !identity.combinedSourcesInfo) {
    return null
  }
  const {
    atomicClassSc = [],
    vesselClassSc = [],
    vesselClassScore = [],
    prodGeartypeSource = [],
    vesselClassSourceAgreement = [],
  } = identity.combinedSourcesInfo

  const atomicClassInTimerange = atomicClassSc.find((source) =>
    getIsCombinedSourceInTimerange(identity, source)
  )
  const vesselClassInTimerange = vesselClassSc.find(
    (source) => getIsCombinedSourceInTimerange(identity, source) && source.value !== undefined
  )
  const registryIdentity = getVesselIdentities(vesselData, {
    identitySource: VesselIdentitySourceEnum.Registry,
  }).find((registry) =>
    isRegistryInTimerange(registry, identity.transmissionDateFrom, identity.transmissionDateTo)
  ) as VesselRegistryInfo | undefined
  const registryVesselClassInTimerange = registryIdentity?.registryVesselClass?.find((source) =>
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
        <Tooltip content="(vesselClassSc) Vessel class inferred by the machine learning model.">
          <span className={cx(styles.secondary, styles.help)}>ML vessel class: </span>
        </Tooltip>
        {vesselClassInTimerange?.value
          ? formatInfoField(vesselClassInTimerange?.value as string, 'geartypes')
          : EMPTY_FIELD_PLACEHOLDER}
      </li>
      {showPipe5Fields && (
        <li>
          <span className={cx(styles.secondary, styles.help)}>ML atomic class: </span>
          {atomicClassInTimerange?.value
            ? formatInfoField(atomicClassInTimerange?.value as string, 'geartypes')
            : EMPTY_FIELD_PLACEHOLDER}
        </li>
      )}
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
      {showPipe5Fields && (
        <li>
          <span className={cx(styles.secondary, styles.help)}>ML vessel class score </span>
          {vesselClassScoreInTimerange?.value !== undefined
            ? vesselClassScoreInTimerange.value
            : EMPTY_FIELD_PLACEHOLDER}
        </li>
      )}
      {showPipe5Fields && (
        <li>
          <span className={cx(styles.secondary, styles.help)}>Vessel class source agreement: </span>
          {vesselClassSourceAgreementInTimerange?.value
            ? vesselClassSourceAgreementInTimerange.value
            : EMPTY_FIELD_PLACEHOLDER}
        </li>
      )}
    </ul>
  )
}

export default VesselIdentityGFWExtendedGeartype
