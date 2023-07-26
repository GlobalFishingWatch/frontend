import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { saveAs } from 'file-saver'
import { Button, Icon, IconButton } from '@globalfishingwatch/ui-components'
import { VesselRegistryOwner } from '@globalfishingwatch/api-types'
import I18nDate from 'features/i18n/i18nDate'
import { IDENTITY_FIELD_GROUPS, REGISTRY_FIELD_GROUPS } from 'features/vessel/vessel.config'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import { selectVesselInfoData } from 'features/vessel/vessel.slice'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from 'utils/info'
import {
  filterRegistryInfoByDates,
  getVesselProperty,
  parseVesselToCSV,
} from 'features/vessel/vessel.utils'
import { selectVesselRegistryIndex } from 'features/vessel/vessel.selectors'
import VesselIdentitySelector from 'features/vessel/identity/VesselIdentitySelector'
import VesselIdentityField from 'features/vessel/identity/VesselIdentityField'
import styles from './VesselIdentity.module.css'

const VesselIdentity = () => {
  const { t } = useTranslation()
  const registryIndex = useSelector(selectVesselRegistryIndex)
  const vessel = useSelector(selectVesselInfoData)

  const start = getVesselProperty(vessel, {
    property: 'transmissionDateFrom',
    registryIndex,
  })

  const end = getVesselProperty(vessel, {
    property: 'transmissionDateTo',
    registryIndex,
  })

  const onDownloadClick = () => {
    if (vessel) {
      const data = parseVesselToCSV(vessel)
      const blob = new Blob([data], { type: 'text/plain;charset=utf-8' })
      saveAs(blob, vessel?.selfReportedInfo?.id + '.csv')
    }
  }

  let title = t('vessel.identity.selfReported', 'Self reported identity')
  if (vessel?.registryInfo?.length) {
    title =
      vessel?.registryInfo?.length === 1
        ? t('vessel.identity.registryIdentity', 'Registry identity')
        : t('vessel.identity.registryIdentities', 'Registry identities')
  }

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h3>
          <label>
            {title} (<I18nDate date={start} /> - <I18nDate date={end} />)
            <DataTerminology size="tiny" type="default" title={title}>
              {t('vessel.terminology.registryInfo', 'registry info terminology')}
            </DataTerminology>
          </label>
        </h3>
        <div className={styles.actionsContainer}>
          <IconButton
            icon="download"
            size="medium"
            onClick={onDownloadClick}
            tooltip={t('download.dataDownload', 'Download Data')}
            tooltipPlacement="top"
          />
          <Button
            className={styles.actionButton}
            disabled
            type="border-secondary"
            size="small"
            tooltip={t('common.comingSoon', 'Coming Soon!')}
            tooltipPlacement="top"
          >
            {t('vessel.identityCalendar', 'See as calendar')} <Icon icon="history" />
          </Button>
        </div>
      </div>
      {vessel && (
        <div className={styles.fields}>
          {IDENTITY_FIELD_GROUPS.map((fieldGroup, index) => (
            <div key={index} className={styles.fieldGroup}>
              {/* TODO: make fields more dynamic to account for VMS */}
              {fieldGroup.map((field) => {
                return (
                  <div key={field.key}>
                    <label>
                      {t(`vessel.${field.label}` as any, field.label)}
                      {field.terminologyKey && (
                        <DataTerminology
                          size="tiny"
                          type="default"
                          title={t(`vessel.${field.label}` as any, field.label)}
                        >
                          {t(field.terminologyKey as any, field.terminologyKey)}
                        </DataTerminology>
                      )}
                    </label>
                    <VesselIdentityField
                      value={formatInfoField(
                        getVesselProperty(vessel, {
                          property: field.key as any,
                          registryIndex: registryIndex,
                        }),
                        field.label
                      )}
                    />
                  </div>
                )
              })}
            </div>
          ))}
          {REGISTRY_FIELD_GROUPS.map(({ key, label }, index) => {
            const filteredRegistryInfo = filterRegistryInfoByDates(vessel[key] || [], {
              start,
              end,
            })
            return (
              <div className={styles.fieldGroup} key={index}>
                <div className={styles.threeCells}>
                  <label>{t(`vessel.${label}` as any, label)}</label>
                  {filteredRegistryInfo?.length > 0 ? (
                    <ul>
                      {filteredRegistryInfo.map((registry) => {
                        const value =
                          key === 'registryOwners'
                            ? `${(registry as VesselRegistryOwner).name} (${formatInfoField(
                                (registry as VesselRegistryOwner).flag,
                                'flag'
                              )})`
                            : registry.sourceCode.join(',')
                        return (
                          <li key={registry.recordId}>
                            <VesselIdentityField value={value} /> {'  '}
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
              </div>
            )
          })}
        </div>
      )}
      <VesselIdentitySelector />
    </div>
  )
}

export default VesselIdentity
