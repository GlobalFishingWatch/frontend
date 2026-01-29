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
  const {
    geartypes,
    inferredLowActivityVesselClassAgRf,
    inferredVesselClassAgNnet,
    messyMmsi,
    onFishingListSr,
    prodGeartypeNnet,
    prodGeartypeSource,
    registryVesselClass,
    rfCoarseClass,
  } = identity.combinedSourcesInfo

  return (
    <ul className={styles.extendedInfo}>
      <li>
        <GFWOnly userGroup="gfw" className={styles.gfwOnly} />
      </li>
      <li>
        <Tooltip content="(prodGeartypeNnet)">
          <span className={cx(styles.secondary, styles.help)}>Previous GFW best gear type: </span>
        </Tooltip>
        {prodGeartypeNnet?.[sourceIndex]?.value !== undefined
          ? prodGeartypeNnet?.[sourceIndex]?.value.toString()
          : EMPTY_FIELD_PLACEHOLDER}
      </li>
      <li>
        <Tooltip content="(inferredVesselClassAgNnet) Vessel class inferred by the machine learning model.">
          <span className={cx(styles.secondary, styles.help)}>Neural net estimate: </span>
        </Tooltip>
        {inferredVesselClassAgNnet?.[sourceIndex]?.value
          ? formatInfoField(inferredVesselClassAgNnet?.[sourceIndex]?.value as string, 'geartypes')
          : EMPTY_FIELD_PLACEHOLDER}
      </li>
      <li>
        <Tooltip content="(registryVesselClass) Data pulled from the vi_ssvid table — an MMSI-based aggregate from available registries. This is for comparison with the “Registry” tab gear, which aggregates at the hull level.">
          <span className={cx(styles.secondary, styles.help)}>Aggregated registry: </span>
        </Tooltip>
        {registryVesselClass?.[sourceIndex]?.value
          ? (formatInfoField(
              registryVesselClass?.[sourceIndex]?.value as string,
              'geartypes'
            ) as string)
          : EMPTY_FIELD_PLACEHOLDER}
      </li>
      <li>
        <Tooltip content="(selfReportedGearType) Vessel self-reports as a fishing vessel in AIS messages 98% or more of the time.">
          <span className={cx(styles.secondary, styles.help)}>
            {identity.sourceCode.includes(SelfReportedSource.Ais) ? 'AIS' : 'VMS'}{' '}
            self-reported:{' '}
          </span>
        </Tooltip>
        {onFishingListSr?.[sourceIndex]?.value
          ? t((t) => t.vessel.gearTypes.fishing)
          : t((t) => t.vessel.gearTypes.other)}
      </li>
      <li>
        <Tooltip content="(prodGeartypeSource) Data table and specific field the GFW gear type value is populated from">
          <span className={cx(styles.secondary, styles.help)}>BQ Source: </span>
        </Tooltip>
        {(prodGeartypeSource?.[sourceIndex]?.value as string)?.toLowerCase() ||
          EMPTY_FIELD_PLACEHOLDER}
      </li>
      <li>
        <Tooltip content="(geartype)">
          <span className={cx(styles.secondary, styles.help)}>Random Forest estimate: </span>
        </Tooltip>
        {geartypes?.[sourceIndex]?.name
          ? (formatInfoField(geartypes?.[sourceIndex]?.name as string, 'geartypes') as string)
          : EMPTY_FIELD_PLACEHOLDER}
      </li>
      <li>
        <Tooltip content="(rfCoarseClass)">
          <span className={cx(styles.secondary, styles.help)}>RF coarse class: </span>
        </Tooltip>
        {rfCoarseClass?.[sourceIndex]?.value
          ? (rfCoarseClass?.[sourceIndex]?.value as string).toLowerCase()
          : EMPTY_FIELD_PLACEHOLDER}
      </li>
      <li>
        <Tooltip content="(inferredLowActivityVesselClassAgRf)">
          <span className={cx(styles.secondary, styles.help)}>
            Inferred low activity vessel class:
          </span>
        </Tooltip>
        {inferredLowActivityVesselClassAgRf?.[sourceIndex]?.value
          ? (inferredLowActivityVesselClassAgRf?.[sourceIndex]?.value as string).toLowerCase()
          : EMPTY_FIELD_PLACEHOLDER}
      </li>
      <li>
        <Tooltip content="(messyMmsi)">
          <span className={cx(styles.secondary, styles.help)}>Messy MMSI: </span>
        </Tooltip>
        {messyMmsi?.[sourceIndex]?.value !== undefined
          ? messyMmsi?.[sourceIndex]?.value.toString()
          : EMPTY_FIELD_PLACEHOLDER}
      </li>
    </ul>
  )
}

export default VesselIdentityGFWExtendedGeartype
