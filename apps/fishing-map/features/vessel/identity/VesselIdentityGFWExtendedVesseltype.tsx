import { useSelector } from 'react-redux'
import cx from 'classnames'

import { Tooltip } from '@globalfishingwatch/ui-components'

import type { VesselLastIdentity } from 'features/search/search.slice'
import GFWOnly from 'features/user/GFWOnly'
import { selectIsGFWUser } from 'features/user/selectors/user.selectors'
import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'

import styles from './VesselIdentity.module.css'

type VesselIdentityGFWExtendedVesseltypeProps = {
  identity: VesselLastIdentity
  sourceIndex: number
}
const VesselIdentityGFWExtendedVesseltype = ({
  identity,
  sourceIndex,
}: VesselIdentityGFWExtendedVesseltypeProps) => {
  const isGFWUser = useSelector(selectIsGFWUser)

  if (!isGFWUser) {
    return null
  }
  const { prodShiptypeNnet } = identity.combinedSourcesInfo

  return (
    <ul className={styles.extendedInfo}>
      <li>
        <GFWOnly userGroup="gfw" className={styles.gfwOnly} />
      </li>
      <li>
        <Tooltip content="(prodShiptypeNnet)">
          <span className={cx(styles.secondary, styles.help)}>Previous GFW best vessel type: </span>
        </Tooltip>
        {prodShiptypeNnet?.[sourceIndex]?.value !== undefined
          ? prodShiptypeNnet?.[sourceIndex]?.value.toString()
          : EMPTY_FIELD_PLACEHOLDER}
      </li>
    </ul>
  )
}

export default VesselIdentityGFWExtendedVesseltype
