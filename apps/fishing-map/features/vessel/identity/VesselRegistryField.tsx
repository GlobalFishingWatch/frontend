import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import type {
  VesselRegistryOperator,
  VesselRegistryOwner,
  VesselRegistryProperty,
} from '@globalfishingwatch/api-types'

import I18nDate from 'features/i18n/i18nDate'
import { useRegionTranslationsById } from 'features/regions/regions.hooks'
import type { VesselLastIdentity } from 'features/search/search.slice'
import GFWOnly from 'features/user/GFWOnly'
import { selectIsGFWUser } from 'features/user/selectors/user.selectors'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from 'utils/info'

import type { VesselRenderField } from '../vessel.config'
import { filterRegistryInfoByDateAndSSVID } from '../vessel.utils'

import DataTerminology from './DataTerminology'
import VesselIdentityField from './VesselIdentityField'

import styles from './VesselIdentity.module.css'

const RegistryOperatorField = ({
  registryField,
  vesselIdentity,
}: {
  registryField: VesselRenderField
  vesselIdentity: VesselLastIdentity
}) => {
  const { key } = registryField
  const operator = vesselIdentity[key as keyof VesselLastIdentity] as VesselRegistryOperator

  return (
    <div>
      {typeof operator === 'string' && operator !== '' ? (
        <VesselIdentityField value={operator} />
      ) : operator?.name ? (
        <Fragment>
          <VesselIdentityField
            value={
              formatInfoField(operator?.name?.replaceAll('"', '').trim(), 'operator') as string
            }
          />{' '}
          {operator.flag && `(${formatInfoField(operator.flag, 'flag')}) `}
          {operator.dateFrom && operator.dateTo && (
            <span className={styles.secondary}>
              <I18nDate date={operator.dateFrom} /> - <I18nDate date={operator.dateTo} />
            </span>
          )}
        </Fragment>
      ) : (
        <VesselIdentityField value={EMPTY_FIELD_PLACEHOLDER} />
      )}
    </div>
  )
}
const VesselRegistryField = ({
  registryField,
  vesselIdentity,
  showLabel = true,
}: {
  registryField: VesselRenderField
  vesselIdentity: VesselLastIdentity
  showLabel?: boolean
}) => {
  const { t } = useTranslation()
  const isGFWUser = useSelector(selectIsGFWUser)
  const { key, label, terminologyKey } = registryField
  const { getRegionTranslationsById } = useRegionTranslationsById()
  if (key === 'operator') {
    return (
      <div className={styles.fieldGroupContainer} key={key}>
        {showLabel && (
          <div className={styles.labelContainer}>
            <label>{t(`vessel.registryOperator`, 'Operators')}</label>
            <DataTerminology title={t('vessel.operator', 'Operator')} terminologyKey="operator" />
          </div>
        )}
        <RegistryOperatorField registryField={registryField} vesselIdentity={vesselIdentity} />
      </div>
    )
  }
  if (key === 'recordId') {
    if (!isGFWUser) {
      return null
    }
    return (
      <div className={cx(styles.fieldGroupContainer, styles.flex)} key={key}>
        {showLabel && (
          <div className={styles.labelContainer}>
            <label>
              {t(`vessel.recordId`, 'Record ID')}
              <GFWOnly />
            </label>
          </div>
        )}
        {vesselIdentity.recordId && <VesselIdentityField value={vesselIdentity.recordId} />}
      </div>
    )
  }
  const allRegistryInfo = vesselIdentity[
    key as keyof VesselLastIdentity
  ] as VesselRegistryProperty[]
  if (!allRegistryInfo) return null
  const timerange = {
    start: vesselIdentity.transmissionDateFrom,
    end: vesselIdentity.transmissionDateTo,
  }
  const filteredRegistryInfo = filterRegistryInfoByDateAndSSVID(
    vesselIdentity[key as keyof VesselLastIdentity] as VesselRegistryProperty[],
    timerange,
    vesselIdentity.ssvid
  )

  if (!filteredRegistryInfo) return null

  const isAuthorizations = key === 'registryPublicAuthorizations'

  return (
    <div className={styles.fieldGroupContainer} key={key}>
      {showLabel && (
        <div className={styles.labelContainer}>
          <label className={styles.twoCells}>{t(`vessel.${label}`, label || '')}</label>
          {terminologyKey && (
            <DataTerminology
              title={t(`vessel.${label}`, label || '')}
              terminologyKey={terminologyKey}
            />
          )}
        </div>
      )}
      {allRegistryInfo?.length > 0 ? (
        <Fragment>
          <ul
            className={cx(styles.fieldGroup, {
              [styles.twoColumns]: isAuthorizations,
            })}
            style={
              isAuthorizations
                ? {
                    gridTemplateRows: `repeat(${Math.ceil(filteredRegistryInfo.length / 2)}, 1fr)`,
                  }
                : undefined
            }
          >
            {allRegistryInfo.map((registry, index) => {
              const registryOverlapsTimeRange = filteredRegistryInfo.includes(registry)
              const fieldType = key === 'registryOwners' ? 'owner' : 'authorization'
              let Component = <VesselIdentityField value="" />
              if (registryOverlapsTimeRange) {
                if (fieldType === 'owner') {
                  const value = `${formatInfoField(
                    (registry as VesselRegistryOwner).name,
                    'owner'
                  )} (${formatInfoField((registry as VesselRegistryOwner).flag, 'flag')})`
                  Component = <VesselIdentityField value={value} />
                } else {
                  const sourceTranslations = (registry.sourceCode as any[])
                    .map(getRegionTranslationsById)
                    .join(',')
                  Component = (
                    <VesselIdentityField
                      tooltip={sourceTranslations}
                      className={styles.help}
                      value={formatInfoField(registry.sourceCode.join(','), fieldType) as string}
                    />
                  )
                }
              }
              return (
                <li
                  key={`${registry.recordId}-${index}`}
                  className={cx({
                    [styles.threeCells]: key === 'registryOwners',
                    [styles.hidden]: !registryOverlapsTimeRange,
                  })}
                >
                  {Component}{' '}
                  {registry.dateFrom && registry.dateTo && (
                    <span className={styles.secondary}>
                      <I18nDate date={registry.dateFrom} /> - <I18nDate date={registry.dateTo} />
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
          {isAuthorizations && showLabel && (
            <p className={styles.disclaimer}>
              {t(
                'vessel.authorizationDatesDisclaimer',
                'The most recent vessel authorized date is the last date Global Fishing Watch collected data. Visit registry source to verify status.'
              )}
            </p>
          )}
        </Fragment>
      ) : (
        EMPTY_FIELD_PLACEHOLDER
      )}
    </div>
  )
}

export default VesselRegistryField
