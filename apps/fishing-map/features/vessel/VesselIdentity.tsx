import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button, Icon, IconButton, TransmissionsTimeline } from '@globalfishingwatch/ui-components'
import I18nDate from 'features/i18n/i18nDate'
import { FIRST_YEAR_OF_DATA } from 'data/config'
import { Locale } from 'types'
import {
  IDENTITY_FIELDS_INFO_AVAILABLE,
  IDENTITY_FIELD_GROUPS,
} from 'features/vessel/vessel.config'
import DataAndTerminology from 'features/vessel/data-and-terminology/DataAndTerminology'
import { selectVesselInfoData } from 'features/vessel/vessel.slice'
import { formatAdvancedInfoField } from 'utils/info'
import styles from './VesselIdentity.module.css'

const VesselIdentity = () => {
  const { t, i18n } = useTranslation(['translations', 'dataTerminology'])
  const vessel = useSelector(selectVesselInfoData)
  const transmissionStart = (vessel?.firstTransmissionDate ||
    vessel?.transmissionDateFrom) as string
  const transmissionEnd = (vessel?.lastTransmissionDate || vessel?.transmissionDateTo) as string
  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h3>
          <label>
            {t('vessel.identity', 'Identity')} - {t('vessel.identityLatest', 'Latest values')}
          </label>
        </h3>
        <div className={styles.actionsContainer}>
          {/* TODO: create functions */}
          <Button
            className={styles.actionButton}
            disabled
            tooltip={t('common.comingSoon', 'Coming Soon!')}
            tooltipPlacement="top"
          >
            {t('vessel.identitySeeHistoric', 'See all historical values')} <Icon icon="download" />
          </Button>
          <IconButton
            icon="copy"
            size="medium"
            type="border"
            tooltip={t('vessel.identityCopy', 'Copy identity values')}
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
                    {IDENTITY_FIELDS_INFO_AVAILABLE.includes(field.key) && (
                      <DataAndTerminology
                        size="tiny"
                        type="default"
                        title={t(`vessel.${field.label}` as any, field.label)}
                      >
                        {t(
                          `dataTerminology:vessel.${field.label}`,
                          `${field.label} field description`
                        )}
                      </DataAndTerminology>
                    )}
                  </label>
                  {formatAdvancedInfoField(vessel, field)}
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
                firstTransmissionDate={transmissionStart}
                lastTransmissionDate={transmissionEnd}
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
