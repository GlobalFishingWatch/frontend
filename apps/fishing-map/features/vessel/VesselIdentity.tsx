import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { saveAs } from 'file-saver'
import { Fragment } from 'react'
import { Button, Icon, IconButton, TransmissionsTimeline } from '@globalfishingwatch/ui-components'
import { VesselRegistryOwner } from '@globalfishingwatch/api-types'
import I18nDate, { formatI18nDate } from 'features/i18n/i18nDate'
import { FIRST_YEAR_OF_DATA } from 'data/config'
import { Locale } from 'types'
import { IDENTITY_FIELD_GROUPS, REGISTRY_FIELD_GROUPS } from 'features/vessel/vessel.config'
import DataTerminology from 'features/vessel/DataTerminology'
import { selectVesselInfoData } from 'features/vessel/vessel.slice'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from 'utils/info'
import {
  filterRegistryInfoByDates,
  getVesselProperty,
  parseVesselToCSV,
} from 'features/vessel/vessel.utils'
import { selectVesselRegistryIndex } from 'features/vessel/vessel.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import styles from './VesselIdentity.module.css'

const VesselIdentity = () => {
  const { t, i18n } = useTranslation()
  const registryIndex = useSelector(selectVesselRegistryIndex)
  const { dispatchQueryParams } = useLocationConnect()
  const vessel = useSelector(selectVesselInfoData)

  const start = getVesselProperty(vessel, {
    property: 'transmissionDateFrom',
    registryIndex,
  })

  const end = getVesselProperty(vessel, {
    property: 'transmissionDateTo',
    registryIndex,
  })

  const transmissionDates =
    vessel?.registryInfo?.map((registry) => ({
      start: registry.transmissionDateFrom,
      end: registry.transmissionDateTo,
    })) ?? []

  const setRegistryIndex = (index: number) => {
    dispatchQueryParams({ vesselRegistryIndex: index })
  }

  const onDownloadClick = () => {
    if (vessel) {
      const data = parseVesselToCSV(vessel)
      const blob = new Blob([data], { type: 'text/plain;charset=utf-8' })
      saveAs(blob, vessel?.coreInfo?.id + '.csv')
    }
  }

  const isLatestInfo = registryIndex === 0

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h3>
          <label>
            {isLatestInfo ? (
              t('vessel.latestIdentity', 'Latest identity')
            ) : (
              <Fragment>
                {t('vessel.identity', 'Identity')}{' '}
                {t('common.dateRange', { start: formatI18nDate(start), end: formatI18nDate(end) })}
              </Fragment>
            )}
          </label>
        </h3>
        <div className={styles.actionsContainer}>
          <Button
            className={styles.actionButton}
            disabled
            type="border-secondary"
            size="small"
            tooltip={t('common.comingSoon', 'Coming Soon!')}
            tooltipPlacement="top"
          >
            {t('vessel.identitySeeHistory', 'See identity history')} <Icon icon="history" />
          </Button>
          <IconButton
            icon="download"
            size="medium"
            type="border"
            onClick={onDownloadClick}
            tooltip={t('download.dataDownload', 'Download Data')}
            tooltipPlacement="top"
          />
        </div>
      </div>
      {vessel && (
        <div className={styles.fields}>
          {IDENTITY_FIELD_GROUPS.map((fieldGroup, index) => (
            <div key={index} className={cx(styles.fieldGroup, styles.border)}>
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
                    {formatInfoField(
                      getVesselProperty(vessel, {
                        property: field.key as any,
                        registryIndex: registryIndex,
                      }),
                      field.label
                    )}
                  </div>
                )
              })}
            </div>
          ))}
          {REGISTRY_FIELD_GROUPS.map(({ key, label }) => {
            const filteredRegistryInfo = filterRegistryInfoByDates(vessel[key] || [], {
              start,
              end,
            })
            return (
              <div className={cx(styles.fieldGroup, styles.border)}>
                <div className={styles.threeCells}>
                  <label>{t(`vessel.${label}` as any, label)}</label>
                  {filteredRegistryInfo?.length > 0 ? (
                    <ul>
                      {filteredRegistryInfo.map((registry) => (
                        <li>
                          {key === 'registryOwners' ? (
                            <Fragment>
                              {(registry as VesselRegistryOwner).name} - (
                              {(registry as VesselRegistryOwner).flag})
                            </Fragment>
                          ) : (
                            registry.sourceCode.join(',')
                          )}
                          <span className={styles.secondary}>
                            (<I18nDate date={registry.dateFrom} /> -{' '}
                            <I18nDate date={registry.dateTo} />)
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    EMPTY_FIELD_PLACEHOLDER
                  )}
                </div>
              </div>
            )
          })}
          <div className={styles.fieldGroup}>
            <div className={cx(styles.threeCells, styles.transmission)}>
              <IconButton
                size="small"
                icon="arrow-left"
                onClick={() => setRegistryIndex(registryIndex - 1)}
              />
              <TransmissionsTimeline
                dates={transmissionDates}
                onDateClick={(dates, index) => setRegistryIndex(index)}
                currentDateIndex={registryIndex}
                firstYearOfData={FIRST_YEAR_OF_DATA}
                locale={i18n.language as Locale}
              />
              <IconButton
                size="small"
                icon="arrow-right"
                onClick={() => setRegistryIndex(registryIndex + 1)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VesselIdentity
