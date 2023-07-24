import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { saveAs } from 'file-saver'
import {
  Button,
  Icon,
  IconButton,
  TransmissionsTimeline,
  TransmissionsTimelineProps,
} from '@globalfishingwatch/ui-components'
import I18nDate from 'features/i18n/i18nDate'
import { FIRST_YEAR_OF_DATA } from 'data/config'
import { Locale } from 'types'
import { IDENTITY_FIELD_GROUPS } from 'features/vessel/vessel.config'
import DataTerminology from 'features/vessel/DataTerminology'
import { selectVesselInfoData } from 'features/vessel/vessel.slice'
import { formatInfoField } from 'utils/info'
import { getVesselProperty, parseVesselToCSV } from 'features/vessel/vessel.utils'
import { selectVesselRegistryIndex } from 'features/vessel/vessel.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import styles from './VesselIdentity.module.css'

const VesselIdentity = () => {
  const { t, i18n } = useTranslation()
  const currentRegistryIndex = useSelector(selectVesselRegistryIndex)
  const { dispatchQueryParams } = useLocationConnect()
  const vessel = useSelector(selectVesselInfoData)

  const transmissionStart = getVesselProperty(vessel, {
    property: 'transmissionDateFrom',
    registryIndex: currentRegistryIndex,
  })
  const transmissionEnd = getVesselProperty(vessel, {
    property: 'transmissionDateTo',
    registryIndex: currentRegistryIndex,
  })
  const transmissionDates =
    vessel?.registryInfo?.map((registry) => ({
      start: registry.transmissionDateFrom,
      end: registry.transmissionDateTo,
    })) ?? []

  const onRegistryIndexChange: TransmissionsTimelineProps['onDateClick'] = (dates, index) => {
    dispatchQueryParams({ vesselRegistryIndex: index })
  }

  const onDownloadClick = () => {
    if (vessel) {
      const data = parseVesselToCSV(vessel)
      const blob = new Blob([data], { type: 'text/plain;charset=utf-8' })
      saveAs(blob, vessel?.coreInfo?.id + '.csv')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h3>
          <label>
            {t('vessel.identity', 'Identity')} - {t('vessel.identityLatest', 'Latest values')}
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
            {t('vessel.identitySeeHistoric', 'See all historical values')} <Icon icon="download" />
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
              {fieldGroup.map((field) => (
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
                      registryIndex: currentRegistryIndex,
                    }),
                    field.key
                  )}
                </div>
              ))}
            </div>
          ))}
          <div className={styles.fieldGroup}>
            <div className={styles.twoCells}>
              <label>{t('vessel.transmissionDates', 'Transmission dates')}</label>
              <span>
                {t('common.from', 'From')} <I18nDate date={transmissionStart} />{' '}
                {t('common.to', 'to')} <I18nDate date={transmissionEnd} />
              </span>
              <TransmissionsTimeline
                dates={transmissionDates}
                onDateClick={onRegistryIndexChange}
                currentDateIndex={currentRegistryIndex}
                firstYearOfData={FIRST_YEAR_OF_DATA}
                locale={i18n.language as Locale}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VesselIdentity
