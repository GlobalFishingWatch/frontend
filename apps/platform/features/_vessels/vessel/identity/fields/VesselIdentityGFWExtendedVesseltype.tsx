import { useSelector } from 'react-redux'
import cx from 'classnames'

import type { SelfReportedInfo } from '@globalfishingwatch/api-types'
import { Tooltip } from '@globalfishingwatch/ui-components'

import GFWOnly from 'features/_user/GFWOnly'
import { selectIsGFWUser } from 'features/_user/selectors/user.selectors'
import type { VesselLastIdentity } from 'features/_vessels/search/search.slice'
import { getIsCombinedSourceInTimerange } from 'features/_vessels/vessel/identity/fields/vessel-identity.utils'
import { selectShowPipe5IdentityFields } from 'features/_vessels/vessel/vessel.config.selectors'
import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'

import styles from '../VesselIdentity.module.css'

type VesselIdentityGFWExtendedVesseltypeProps = {
  identity: VesselLastIdentity
  sourceIndex: number
}
const VesselIdentityGFWExtendedVesseltype = ({
  identity,
}: VesselIdentityGFWExtendedVesseltypeProps) => {
  const isGFWUser = useSelector(selectIsGFWUser)
  const showPipe5Fields = useSelector(selectShowPipe5IdentityFields)

  if (!isGFWUser || !identity.combinedSourcesInfo) {
    return null
  }
  const { coarseClass = [], fishingSourceAgreement = [] } = identity.combinedSourcesInfo
  const { onFishingListSr = [], shipnameIndicatesLikelyGear = [] } = identity as SelfReportedInfo
  const onFishingListInTimerange = onFishingListSr.find((source) =>
    getIsCombinedSourceInTimerange(identity, source)
  )
  const coarseClassInTimerange = coarseClass.find((source) =>
    getIsCombinedSourceInTimerange(identity, source)
  )
  const fishingSourceAgreementInTimerange = fishingSourceAgreement?.find((source) =>
    getIsCombinedSourceInTimerange(identity, source)
  )

  const shipnameIndicatesLikelyGearInTimerange = shipnameIndicatesLikelyGear?.find((source) =>
    getIsCombinedSourceInTimerange(identity, source)
  )
  return (
    <ul className={styles.extendedInfo}>
      <li>
        <GFWOnly userGroup="gfw" className={styles.gfwOnly} />
      </li>
      <li>
        <Tooltip content="(coarseClass)">
          <span className={cx(styles.secondary, styles.help)}>ML coarse class: </span>
        </Tooltip>
        {coarseClassInTimerange?.value !== undefined
          ? coarseClassInTimerange.value.toString()
          : EMPTY_FIELD_PLACEHOLDER}
      </li>
      {showPipe5Fields && (
        <li>
          <span className={cx(styles.secondary, styles.help)}>
            Shipname indicates likely gear:{' '}
          </span>
          {shipnameIndicatesLikelyGearInTimerange?.value !== undefined
            ? shipnameIndicatesLikelyGearInTimerange.value.toString()
            : EMPTY_FIELD_PLACEHOLDER}
        </li>
      )}
      {showPipe5Fields && (
        <li>
          <span className={cx(styles.secondary, styles.help)}>Fishing source agreement: </span>
          {fishingSourceAgreementInTimerange?.value !== undefined
            ? fishingSourceAgreementInTimerange.value.toString()
            : EMPTY_FIELD_PLACEHOLDER}
        </li>
      )}
      <li>
        <span className={cx(styles.secondary, styles.help)}>On fishing list: </span>
        {onFishingListInTimerange?.value !== undefined
          ? onFishingListInTimerange.value.toString()
          : EMPTY_FIELD_PLACEHOLDER}
      </li>
    </ul>
  )
}

export default VesselIdentityGFWExtendedVesseltype
