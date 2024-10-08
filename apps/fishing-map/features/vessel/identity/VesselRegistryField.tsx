import cx from 'classnames'
import { t } from 'i18next'
import { uniq } from 'es-toolkit'
import { VesselRegistryOperator, VesselRegistryOwner, VesselRegistryProperty } from "@globalfishingwatch/api-types"
import { Tooltip } from "@globalfishingwatch/ui-components"
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from "utils/info"
import I18nDate from "features/i18n/i18nDate"
import { useRegionTranslationsById } from "features/regions/regions.hooks"
import { VesselLastIdentity } from 'features/search/search.slice'
import { filterRegistryInfoByDateAndSSVID } from "../vessel.utils"
import { VesselRenderField } from '../vessel.config'
import styles from './VesselIdentity.module.css'
import DataTerminology from "./DataTerminology"
import VesselIdentityField from "./VesselIdentityField"
const RegistryOperatorField = ({registryField, vesselIdentity} :{registryField: VesselRenderField ,vesselIdentity: VesselLastIdentity}) => {
  const { key } = registryField
  const operator = vesselIdentity[key as keyof VesselLastIdentity] as VesselRegistryOperator
  if (!operator?.name) return null
  const formatedOperator = uniq(operator.name.split('|').map((s:string) => s.replaceAll('"', '').trim().split(';')).flat())
  return (  <div className={cx(styles.fieldGroupContainer)}>
<label>{t(`vessel.registryOperator`, 'Operators')}</label>
{formatedOperator.map((operator, index) => (
  <p>
    <VesselIdentityField key={index} value={operator} />
  </p>
))}
  </div>
)
}
const VesselRegistryField = ({registryField, vesselIdentity} :{registryField: VesselRenderField ,vesselIdentity: VesselLastIdentity}) => {
    const { key, label, terminologyKey } = registryField
    const { getRegionTranslationsById } = useRegionTranslationsById()
    if (key === 'operator') {
      return <RegistryOperatorField registryField={registryField} vesselIdentity={vesselIdentity} />
    }
    const allRegistryInfo = vesselIdentity[key as keyof VesselLastIdentity]as VesselRegistryProperty[]
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
    
    return (
      <div className={styles.fieldGroupContainer} key={key}>
        <div className={styles.labelContainer}>
          <label className={styles.twoCells}>{t(`vessel.${label}`, label || '')}</label>
          {terminologyKey && (
            <DataTerminology
              size="tiny"
              type="default"
              title={t(`vessel.${label}`, label || '')}
              terminologyKey={terminologyKey}
            />
          )}
        </div>
        {allRegistryInfo?.length > 0 ? (
          <ul
            className={cx(styles.fieldGroup, styles.twoColumns)}
            style={
              key === 'registryPublicAuthorizations'
                ? {
                    gridTemplateRows: `repeat(${Math.ceil(
                      filteredRegistryInfo.length / 2
                    )}, 1fr)`,
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
                  )} (${formatInfoField(
                    (registry as VesselRegistryOwner).flag,
                    'flag'
                  )})`
                  Component = <VesselIdentityField value={value} />
                } else {
                  const sourceTranslations = (registry.sourceCode as any[])
                    .map(getRegionTranslationsById)
                    .join(',')
                  Component = (
                    <Tooltip content={sourceTranslations}>
                      <VesselIdentityField
                        className={styles.help}
                        value={
                          formatInfoField(
                            registry.sourceCode.join(','),
                            fieldType
                          ) as string
                        }
                      />
                    </Tooltip>
                  )
                }
              }
              return (
                <li
                  key={`${registry.recordId}-${index}`}
                  className={cx({
                    [styles.twoCells]: key === 'registryOwners',
                    [styles.hidden]: !registryOverlapsTimeRange,
                  })}
                >
                  {Component}{' '}
                  <span className={styles.secondary}>
                    <I18nDate date={registry.dateFrom} /> -{' '}
                    <I18nDate date={registry.dateTo} />
                  </span>
                </li>
              )
            })}
          </ul>
                    ) : (
                      EMPTY_FIELD_PLACEHOLDER
                    )}
                  </div>
                )
}

export default VesselRegistryField
