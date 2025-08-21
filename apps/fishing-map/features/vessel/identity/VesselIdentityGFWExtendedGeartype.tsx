import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { SelfReportedSource } from '@globalfishingwatch/api-types'
import { Tooltip } from '@globalfishingwatch/ui-components'

import type { VesselLastIdentity } from 'features/search/search.slice'
import GFWOnly from 'features/user/GFWOnly'
import { selectIsGFWUser } from 'features/user/selectors/user.selectors'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from 'utils/info'

import styles from './VesselIdentity.module.css'

type VesselIdentityGFWExtendedGeartypeProps = {
  identity: VesselLastIdentity
  sourceIndex: number
}
const VesselIdentityGFWExtendedGeartype = ({
  identity,
  sourceIndex,
}: VesselIdentityGFWExtendedGeartypeProps) => {
  const { t } = useTranslation()
  const isGFWUser = useSelector(selectIsGFWUser)

  if (!isGFWUser) {
    return null
  }

  const selfReportedGearType = identity?.combinedSourcesInfo?.onFishingListSr?.[sourceIndex]?.value
    ? t('vessel.gearTypes.fishing')
    : t('vessel.gearTypes.other')
  const neuralNetGearType = identity?.combinedSourcesInfo?.inferredVesselClassAg?.[sourceIndex]
    ?.value as string
  const bqSource = identity?.combinedSourcesInfo?.prodGeartypeSource?.[sourceIndex]?.value as string
  const registryGearType = identity?.combinedSourcesInfo?.registryVesselClass?.[sourceIndex]
    ?.value as string
  return (
    <ul className={styles.extendedInfo}>
      <li>
        <GFWOnly userGroup="gfw" className={styles.gfwOnly} />
      </li>
      <li>
        <Tooltip content="Vessel class inferred by the machine learning model.">
          <span className={cx(styles.secondary, styles.help)}>Machine learning estimate: </span>
        </Tooltip>
        {formatInfoField(neuralNetGearType, 'geartypes') as string}
      </li>
      <li>
        <Tooltip content="Data pulled from the vi_ssvid table — an MMSI-based aggregate from available registries. This is for comparison with the “Registry” tab gear, which aggregates at the hull level.">
          <span className={cx(styles.secondary, styles.help)}>Aggregated registry: </span>
        </Tooltip>
        {formatInfoField(registryGearType, 'geartypes') as string}
      </li>
      <li>
        <Tooltip content="Vessel self-reports as a fishing vessel in AIS messages 98% or more of the time.">
          <span className={cx(styles.secondary, styles.help)}>
            {identity.sourceCode.includes(SelfReportedSource.Ais) ? 'AIS' : 'VMS'}{' '}
            self-reported:{' '}
          </span>
        </Tooltip>
        {selfReportedGearType || EMPTY_FIELD_PLACEHOLDER}
      </li>
      <li>
        <Tooltip content="Data table and specific field the GFW gear type value is populated from">
          <span className={cx(styles.secondary, styles.help)}>BQ Source: </span>
        </Tooltip>
        {bqSource?.toLowerCase() || EMPTY_FIELD_PLACEHOLDER}
      </li>
    </ul>
  )
}

export default VesselIdentityGFWExtendedGeartype
