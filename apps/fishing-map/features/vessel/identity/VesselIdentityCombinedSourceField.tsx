/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { Fragment, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { VesselIdentitySourceEnum, type VesselInfo } from '@globalfishingwatch/api-types'
import { getUTCDateTime } from '@globalfishingwatch/data-transforms'
import { Icon } from '@globalfishingwatch/ui-components'

import type { VesselLastIdentity } from 'features/search/search.slice'
import { selectIsGFWUser } from 'features/user/selectors/user.selectors'
import VesselIdentityField from 'features/vessel/identity/VesselIdentityField'
import { selectVesselInfoData } from 'features/vessel/selectors/vessel.selectors'
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
  const vesselInfo = useSelector(selectVesselInfoData)
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
          const dates = yearTo === yearFrom ? yearTo : `${yearFrom} - ${yearTo}`
          const Component = (
            <Fragment>
              <VesselIdentityField value={formatInfoField(name, property) as string} />{' '}
              {combinedSource?.length > 1 && <span className={styles.secondary}>({dates})</span>}
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
            const registryGearType = vesselInfo?.identities.find((identity) => {
              const identityYearFrom = getUTCDateTime(identity.transmissionDateFrom).year
              const identityYearTo = getUTCDateTime(identity.transmissionDateTo).year
              return (
                identity.identitySource === VesselIdentitySourceEnum.Registry &&
                identityYearFrom <= yearTo &&
                identityYearTo >= yearFrom
              )
            })?.geartypes
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
                      <span className={styles.secondary}>
                        {t('vessel.infoSources.selfReported', 'Self Reported')}:{' '}
                      </span>
                      {selfReportedGearType}
                    </li>
                    <li>
                      <span className={styles.secondary}>Neural Net: </span>
                      {formatInfoField(neuralNetGearType, property) as string}
                    </li>
                    <li>
                      <span className={styles.secondary}>
                        {t('vessel.infoSources.registry', 'Registry')}:{' '}
                      </span>
                      {formatInfoField(registryGearType, property) as string}
                    </li>
                    <li>
                      <span className={styles.secondary}>BQ Source: </span>
                      {bqSource.toLowerCase()}
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
