import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button, Icon, IconButton, TransmissionsTimeline } from '@globalfishingwatch/ui-components'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from 'utils/info'
import { selectVesselInfoData } from 'features/vessel/vessel.slice'
import I18nDate from 'features/i18n/i18nDate'
import I18nFlag from 'features/i18n/i18nFlag'
import { FIRST_YEAR_OF_DATA } from 'data/config'
import { Locale } from 'types'
import styles from './VesselIdentity.module.css'

const IDENTITY_FIELD_GROUPS = [
  ['shipname', 'flag'],
  ['vesselType', 'gearType'],
  ['mmsi', 'imo', 'callsign'],
]
const VesselIdentity = () => {
  const { t, i18n } = useTranslation()
  const vessel = useSelector(selectVesselInfoData)

  const getFieldValue = (field: any) => {
    if (field === 'flag') {
      return <I18nFlag iso={vessel?.flag} />
    }
    if (field === 'vesselType') {
      return t(`vessel.vesselTypes.${vessel?.vesselType}` as any, vessel?.vesselType)
    }
    if (field === 'geartype') {
      return t(`vessel.gearTypes.${vessel?.geartype}` as any, vessel?.geartype)
    }
    if (field === 'mmsi') {
      return (
        <a
          className={styles.link}
          target="_blank"
          rel="noreferrer"
          href={`https://www.marinetraffic.com/en/ais/details/ships/${vessel?.mmsi}`}
        >
          {formatInfoField(vessel?.mmsi, field)}
        </a>
      )
    }
    return formatInfoField(vessel?.[field], field)
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
      <ul className={styles.fields}>
        {IDENTITY_FIELD_GROUPS.map((fieldGroup) => (
          <div className={cx(styles.fieldGroup, styles.border)}>
            {fieldGroup.map((field) => {
              console.log('field:', field)
              return (
                <li key={field}>
                  <label>{t(`vessel.${field}` as any, field)}</label>
                  {getFieldValue(field) || EMPTY_FIELD_PLACEHOLDER}
                </li>
              )
            })}
          </div>
        ))}
        <div className={styles.fieldGroup}>
          <div className={styles.twoCells}>
            <label>{t('vessel.transmissionDates', 'Transmission dates')}</label>
            <span>
              {t('common.from', 'From')} <I18nDate date={vessel?.firstTransmissionDate} />{' '}
              {t('common.to', 'to')} <I18nDate date={vessel?.lastTransmissionDate} />
            </span>
            <TransmissionsTimeline
              firstTransmissionDate={vessel?.firstTransmissionDate}
              lastTransmissionDate={vessel?.lastTransmissionDate}
              firstYearOfData={FIRST_YEAR_OF_DATA}
              locale={i18n.language as Locale}
            />
          </div>
        </div>
      </ul>
    </div>
  )
}

export default VesselIdentity
