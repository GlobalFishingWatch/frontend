/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { Fragment, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { DateTime } from 'luxon'

import { SelfReportedSource, type VesselInfo } from '@globalfishingwatch/api-types'
import { Icon, Tooltip } from '@globalfishingwatch/ui-components'

import type { VesselLastIdentity } from 'features/search/search.slice'
import GFWOnly from 'features/user/GFWOnly'
import { selectIsGFWUser } from 'features/user/selectors/user.selectors'
import VesselIdentityField from 'features/vessel/identity/VesselIdentityField'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from 'utils/info'

import styles from './VesselIdentity.module.css'

type VesselIdentityCombinedSourceFieldProps = {
  identity: VesselLastIdentity
  property: keyof Pick<VesselInfo, 'geartypes' | 'shiptypes'>
}
const VesselIdentityCombinedSourceField = ({
  identity,
  property,
}: VesselIdentityCombinedSourceFieldProps) => {
  const { t } = useTranslation()
  const isGFWUser = useSelector(selectIsGFWUser)
  const [geartypesExpanded, setGeartypesExpanded] = useState<number | null>(null)
  const combinedSource = identity?.combinedSourcesInfo?.[property]

  const toggleGearTypesExpanded = useCallback(
    (index: number) => {
      setGeartypesExpanded(geartypesExpanded === index ? null : index)
    },
    [geartypesExpanded]
  )

  if (!combinedSource) {
    return identity[property] ? (
      <VesselIdentityField value={formatInfoField(identity[property], property) as string} />
    ) : null
  }

  return (
    <ul>
      {[...combinedSource]
        .sort((a, b) => (a.yearTo < b.yearTo ? 1 : -1))
        .map((source, index) => {
          const { name, yearTo, yearFrom } = source
          const startDate = DateTime.fromISO(identity.transmissionDateFrom)
          const endDate = DateTime.fromISO(identity.transmissionDateTo)
          const sourceYearFrom = DateTime.fromISO(yearFrom.toString())
          const sourceYearTo = DateTime.fromISO(yearTo.toString()).endOf('year')
          const sourceOverlapsTimeRange =
            sourceYearFrom.toMillis() <= endDate.toMillis() &&
            sourceYearTo.toMillis() >= startDate.toMillis()

          if (!sourceOverlapsTimeRange) {
            return null
          }

          const dates = yearTo === yearFrom ? yearTo : `${yearFrom} - ${yearTo}`
          const Component = (
            <Fragment>
              <VesselIdentityField value={formatInfoField(name, property) as string} />{' '}
              <span className={styles.secondary}>({dates})</span>
            </Fragment>
          )

          if (isGFWUser && property === 'geartypes') {
            const selfReportedGearType = identity?.combinedSourcesInfo?.onFishingListSr?.[index]
              ?.value
              ? t('vessel.gearTypes.fishing', 'Fishing')
              : t('vessel.gearTypes.other', 'Other')
            const neuralNetGearType = identity?.combinedSourcesInfo?.inferredVesselClassAg?.[index]
              ?.value as string
            const bqSource = identity?.combinedSourcesInfo?.prodGeartypeSource?.[index]
              ?.value as string
            const registryGearType = identity?.combinedSourcesInfo?.registryVesselClass?.[index]
              ?.value as string
            return (
              <Fragment key={index}>
                <li onClick={() => toggleGearTypesExpanded(index)} className={styles.expandable}>
                  {Component}
                  <Icon
                    className={styles.expandIcon}
                    icon={geartypesExpanded === index ? 'arrow-top' : 'arrow-down'}
                  />
                </li>
                {geartypesExpanded === index && (
                  <ul className={styles.extendedInfo}>
                    <li>
                      <GFWOnly userGroup="gfw" className={styles.gfwOnly} />
                    </li>
                    <li>
                      <Tooltip content="Vessel class inferred by the machine learning model.">
                        <span className={cx(styles.secondary, styles.help)}>
                          Machine learning estimate:{' '}
                        </span>
                      </Tooltip>
                      {formatInfoField(neuralNetGearType, property) as string}
                    </li>
                    <li>
                      <Tooltip content="Data pulled from the vi_ssvid table — an MMSI-based aggregate from available registries. This is for comparison with the “Registry” tab gear, which aggregates at the hull level.">
                        <span className={cx(styles.secondary, styles.help)}>
                          Aggregated registry:{' '}
                        </span>
                      </Tooltip>
                      {formatInfoField(registryGearType, property) as string}
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
                )}
              </Fragment>
            )
          }

          return <li key={index}>{Component}</li>
        })}
    </ul>
  )
}

export default VesselIdentityCombinedSourceField
