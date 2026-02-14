/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { Fragment, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { DateTime } from 'luxon'

import { type VesselInfo } from '@globalfishingwatch/api-types'
import { Icon } from '@globalfishingwatch/ui-components'

import type { VesselLastIdentity } from 'features/search/search.slice'
import { selectIsGFWUser } from 'features/user/selectors/user.selectors'
import VesselIdentityField from 'features/vessel/identity/VesselIdentityField'
import VesselIdentityGFWExtendedGeartype from 'features/vessel/identity/VesselIdentityGFWExtendedGeartype'
import VesselIdentityGFWExtendedVesseltype from 'features/vessel/identity/VesselIdentityGFWExtendedVesseltype'
import { formatInfoField } from 'utils/info'

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
  const [vesseltypesExpanded, setVesseltypesExpanded] = useState<number | null>(null)
  const combinedSource = identity?.combinedSourcesInfo?.[property]

  const toggleGearTypesExpanded = useCallback(
    (index: number) => {
      setGeartypesExpanded(geartypesExpanded === index ? null : index)
    },
    [geartypesExpanded]
  )

  const toggleVesselTypesExpanded = useCallback(
    (index: number) => {
      setVesseltypesExpanded(vesseltypesExpanded === index ? null : index)
    },
    [vesseltypesExpanded]
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
                  <VesselIdentityGFWExtendedGeartype identity={identity} sourceIndex={index} />
                )}
              </Fragment>
            )
          }

          if (isGFWUser && property === 'shiptypes') {
            return (
              <Fragment key={index}>
                <li onClick={() => toggleVesselTypesExpanded(index)} className={styles.expandable}>
                  {Component}
                  <Icon
                    className={styles.expandIcon}
                    icon={vesseltypesExpanded === index ? 'arrow-top' : 'arrow-down'}
                  />
                </li>
                {vesseltypesExpanded === index && (
                  <VesselIdentityGFWExtendedVesseltype identity={identity} sourceIndex={index} />
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
