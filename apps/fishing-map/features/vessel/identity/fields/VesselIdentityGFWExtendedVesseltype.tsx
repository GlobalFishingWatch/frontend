import { useSelector } from 'react-redux'
import cx from 'classnames'

import { Tooltip } from '@globalfishingwatch/ui-components'

import type { VesselLastIdentity } from 'features/search/search.slice'
import GFWOnly from 'features/user/GFWOnly'
import { selectIsGFWUser } from 'features/user/selectors/user.selectors'
import { getIsCombinedSourceInTimerange } from 'features/vessel/identity/fields/vessel-identity.utils'
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

  if (!isGFWUser || !identity.combinedSourcesInfo) {
    return null
  }
  const { onFishingListSr = [], rfCoarseClass = [] } = identity.combinedSourcesInfo
  const onFishingListInTimerange = onFishingListSr.find((source) =>
    getIsCombinedSourceInTimerange(identity, source)
  )
  const rfCoarseClassInTimerange = rfCoarseClass.find((source) =>
    getIsCombinedSourceInTimerange(identity, source)
  )

  return (
    <ul className={styles.extendedInfo}>
      <li>
        <GFWOnly userGroup="gfw" className={styles.gfwOnly} />
      </li>
      {/* pipe5 missing API properties: shipname_indicates_likely_gear, fishing_source_agreement */}
      <li>
        <Tooltip content="(prodShiptypeNnet)">
          <span className={cx(styles.secondary, styles.help)}>ML coarse class: </span>
        </Tooltip>
        {rfCoarseClassInTimerange?.value !== undefined
          ? rfCoarseClassInTimerange.value.toString()
          : EMPTY_FIELD_PLACEHOLDER}
      </li>
      <li>
        <Tooltip content="(prodShiptypeNnet)">
          <span className={cx(styles.secondary, styles.help)}>On fishing list: </span>
        </Tooltip>
        {onFishingListInTimerange?.value !== undefined
          ? onFishingListInTimerange.value.toString()
          : EMPTY_FIELD_PLACEHOLDER}
      </li>
    </ul>
  )
}

export default VesselIdentityGFWExtendedVesseltype
