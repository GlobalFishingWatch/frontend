import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button, Icon, IconButton, TransmissionsTimeline } from '@globalfishingwatch/ui-components'
import { Vessel } from '@globalfishingwatch/api-types'
import I18nDate from 'features/i18n/i18nDate'
import { FIRST_YEAR_OF_DATA } from 'data/config'
import { Locale } from 'types'
import {
  IDENTITY_FIELDS_INFO_AVAILABLE,
  IDENTITY_FIELD_GROUPS,
  VesselRenderField,
} from 'features/vessel/vessel.config'
import DataAndTerminology from 'features/vessel/data-and-terminology/DataAndTerminology'
import { selectVesselInfoDataMerged } from 'features/vessel/vessel.selectors'
import { formatInfoField } from 'utils/info'
import styles from './VesselIdentity.module.css'

const VesselIdentity = () => {
  const { t, i18n } = useTranslation(['translations', 'dataTerminology'])
  const vessel = useSelector(selectVesselInfoDataMerged)

  const formatInfoFieldAdvanced = (vessel: Vessel, field: VesselRenderField, translationFn = t) => {
    if (field.value.includes('.')) {
      const [first, second] = field.value.split('.')
      return formatInfoField(vessel?.[first]?.[0]?.[second], second, translationFn)
    } else {
      return formatInfoField(vessel?.[field.value], field.value, translationFn)
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
                <div key={field.value}>
                  <label>
                    {t(`vessel.${field.label}` as any, field.label)}
                    {IDENTITY_FIELDS_INFO_AVAILABLE.includes(field.value) && (
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
                  {formatInfoFieldAdvanced(vessel, field)}
                </div>
              ))}
            </div>
          ))}
          <div className={styles.fieldGroup}>
            <div className={styles.twoCells}>
              <label>{t('vessel.transmissionDates', 'Transmission dates')}</label>
              <span>
                {t('common.from', 'From')}{' '}
                <I18nDate date={vessel?.firstTransmissionDate as string} /> {t('common.to', 'to')}{' '}
                <I18nDate date={vessel?.lastTransmissionDate as string} />
              </span>
              <TransmissionsTimeline
                firstTransmissionDate={vessel?.firstTransmissionDate as string}
                lastTransmissionDate={vessel?.lastTransmissionDate as string}
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
