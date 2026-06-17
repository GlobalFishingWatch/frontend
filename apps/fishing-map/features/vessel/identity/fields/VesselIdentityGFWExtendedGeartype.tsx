import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { Tooltip } from '@globalfishingwatch/ui-components'

import { IS_RANDOM_FOREST_ENABLED } from 'data/config'
import type { VesselLastIdentity } from 'features/search/search.slice'
import GFWOnly from 'features/user/GFWOnly'
import { selectIsGFWUser, selectIsJACUser } from 'features/user/selectors/user.selectors'
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
  const { t } = useTranslation()
  const isGFWUser = useSelector(selectIsGFWUser)
  const isJACUser = useSelector(selectIsJACUser)

  if ((!isGFWUser && !isJACUser) || !identity.combinedSourcesInfo) {
    return null
  }
  const {
    geartypes,
    inferredLowActivityVesselClassAgRf,
    inferredVesselClassAgNnet,
    messyMmsi,
    prodGeartypeNnet,
    prodGeartypeSource,
    registryVesselClass,
    rfCoarseClass,
  } = identity.combinedSourcesInfo

  const prodGeartypeNnetSort = (prodGeartypeNnet || [])
    .filter(Boolean)
    .sort((a, b) => (a.yearTo < b.yearTo ? 1 : -1))

  return (
    <ul className={styles.extendedInfo}>
      {isGFWUser && (
        <Fragment>
          <li>
            <GFWOnly userGroup="gfw" className={styles.gfwOnly} />
          </li>
          <li>
            <Tooltip content="(prodGeartypeNnet)">
              <span className={cx(styles.secondary, styles.help)}>
                Previous GFW best gear type:{' '}
              </span>
            </Tooltip>
            {prodGeartypeNnetSort?.[0]?.value !== undefined
              ? prodGeartypeNnetSort?.[0]?.value.toString()
              : EMPTY_FIELD_PLACEHOLDER}
          </li>
          <li>
            <Tooltip content="(inferredVesselClassAgNnet) Vessel class inferred by the machine learning model.">
              <span className={cx(styles.secondary, styles.help)}>Neural net estimate: </span>
            </Tooltip>
            {inferredVesselClassAgNnet?.[sourceIndex]?.value
              ? formatInfoField(
                  inferredVesselClassAgNnet?.[sourceIndex]?.value as string,
                  'geartypes'
                )
              : EMPTY_FIELD_PLACEHOLDER}
          </li>
          <li>
            <Tooltip content='(registryVesselClass) Data pulled from the vi_ssvid table — an MMSI-based aggregate from available registries. This is for comparison with the "Registry" tab gear, which aggregates at the hull level.'>
              <span className={cx(styles.secondary, styles.help)}>Aggregated registry: </span>
            </Tooltip>
            {registryVesselClass?.[sourceIndex]?.value
              ? (formatInfoField(
                  registryVesselClass?.[sourceIndex]?.value as string,
                  'geartypes'
                ) as string)
              : EMPTY_FIELD_PLACEHOLDER}
          </li>
        </Fragment>
      )}
      {isGFWUser && (
        <Fragment>
          <li>
            <Tooltip content="(prodGeartypeSource) Data table and specific field the GFW gear type value is populated from">
              <span className={cx(styles.secondary, styles.help)}>BQ Source: </span>
            </Tooltip>
            {(prodGeartypeSource?.[sourceIndex]?.value as string)?.toLowerCase() ||
              EMPTY_FIELD_PLACEHOLDER}
          </li>
          {IS_RANDOM_FOREST_ENABLED && (
            <Fragment>
              <li>
                <Tooltip content="(geartype)">
                  <span className={cx(styles.secondary, styles.help)}>
                    Random Forest estimate:{' '}
                  </span>
                </Tooltip>
                {geartypes?.[sourceIndex]?.name
                  ? (formatInfoField(
                      geartypes?.[sourceIndex]?.name as string,
                      'geartypes'
                    ) as string)
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
                  ? (
                      inferredLowActivityVesselClassAgRf?.[sourceIndex]?.value as string
                    ).toLowerCase()
                  : EMPTY_FIELD_PLACEHOLDER}
              </li>
              <li>
                <Tooltip content="(messyMmsi)">
                  <span className={cx(styles.secondary, styles.help)}>Messy MMSI: </span>
                </Tooltip>
                {messyMmsi?.[sourceIndex]?.value !== undefined
                  ? messyMmsi?.[sourceIndex]?.value?.toString()
                  : EMPTY_FIELD_PLACEHOLDER}
              </li>
            </Fragment>
          )}
        </Fragment>
      )}
    </ul>
  )
}

export default VesselIdentityGFWExtendedGeartype
