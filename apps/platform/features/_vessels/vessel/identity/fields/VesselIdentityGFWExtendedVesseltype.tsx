import { useSelector } from 'react-redux'
import cx from 'classnames'

import { Tooltip } from '@globalfishingwatch/ui-components'

import GFWOnly from 'features/_user/GFWOnly'
import { selectIsGFWUser, selectIsJACUser } from 'features/_user/selectors/user.selectors'
import type { VesselLastIdentity } from 'features/_vessels/search/search.slice'
import { getIsCombinedSourceInTimerange } from 'features/_vessels/vessel/identity/fields/vessel-identity.utils'
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
  const isJACUser = useSelector(selectIsJACUser)

  if ((!isGFWUser && !isJACUser) || !identity.combinedSourcesInfo) {
    return null
  }
  const { coarseClass = [] } = identity.combinedSourcesInfo
  const coarseClassInTimerange = coarseClass.find((source) =>
    getIsCombinedSourceInTimerange(identity, source)
  )
  return (
    <ul className={styles.extendedInfo}>
      <li>
        <GFWOnly userGroup="both" className={styles.gfwOnly} />
      </li>
      <li>
        <Tooltip content="(coarseClass)">
          <span className={cx(styles.secondary, styles.help)}>ML prediction: </span>
        </Tooltip>
        {coarseClassInTimerange?.value !== undefined
          ? coarseClassInTimerange.value.toString()
          : EMPTY_FIELD_PLACEHOLDER}
      </li>
    </ul>
  )
}

export default VesselIdentityGFWExtendedVesseltype
