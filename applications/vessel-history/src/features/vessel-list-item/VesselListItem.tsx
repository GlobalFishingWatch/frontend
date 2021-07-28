import React, { Fragment } from 'react'
import Link from 'redux-first-router-link'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'
import { IconButton } from '@globalfishingwatch/ui-components'
import { VesselSearch as Vessel } from '@globalfishingwatch/api-types'
import { getFlagById } from 'utils/flags'
import { getVesselAPISource } from 'utils/vessel'
import { SHOW_VESSEL_API_SOURCE } from 'data/constants'
import I18nDate, { formatI18nDate } from 'features/i18n/i18nDate'
import styles from './VesselListItem.module.css'
interface ListItemProps {
  saved?: string
  vessel: Vessel
  onDeleteClick?: () => void
}

const VesselListItem: React.FC<ListItemProps> = (props): React.ReactElement => {
  const { t } = useTranslation()
  const { vessel, onDeleteClick } = props
  if (!vessel) {
    return <div></div>
  }

  const flagLabel = getFlagById(vessel.flag)?.label
  const sourceAPI = getVesselAPISource(vessel)

  return (
    <Link
      to={['profile', vessel.dataset ?? 'NA', vessel.id ?? 'NA', vessel.vesselMatchId ?? 'NA']}
      className={styles.vesselItem}
    >
      {props.saved && onDeleteClick && (
        <IconButton
          type="warning"
          size="default"
          icon="delete"
          className={styles.remove}
          onClick={onDeleteClick}
        ></IconButton>
      )}
      <h3>{vessel?.shipname}</h3>
      <div className={styles.identifiers}>
        <div>
          <label>{t('vessel.flag', 'flag')}</label>
          {flagLabel}
        </div>
        {vessel.mmsi && (
          <div>
            <label>{t('vessel.mmsi', 'mmsi')}</label>
            {vessel.mmsi}
          </div>
        )}
        {vessel.imo && vessel.imo !== '0' && (
          <div>
            <label>{t('vessel.imo', 'imo')}</label>
            {vessel.imo}
          </div>
        )}
        {vessel.callsign && (
          <div>
            <label>{t('vessel.callsign', 'callsign')}</label>
            {vessel.callsign}
          </div>
        )}
        {SHOW_VESSEL_API_SOURCE && (
          <div>
            <label>{t('vessel.source', 'source')}</label>
            {sourceAPI.join('+')}
          </div>
        )}
        <div>
          <label>{t('vessel.transmission_plural', 'transmissions')}</label>
          {vessel.firstTransmissionDate || vessel.lastTransmissionDate ? (
            <Fragment>
              {t('common.from', 'from')}{' '}
              {vessel.firstTransmissionDate ? (
                <I18nDate date={vessel.firstTransmissionDate} />
              ) : (
                '-'
              )}{' '}
              {t('common.to', 'to')}{' '}
              {vessel.lastTransmissionDate ? (
                <I18nDate date={vessel.lastTransmissionDate} />
              ) : (
                ' - '
              )}
            </Fragment>
          ) : (
            '-'
          )}
        </div>
        {props.saved && (
          <div>
            <label>{t('vessel.savedOn', 'saved on')}</label>
            {`${formatI18nDate(props.saved, { format: DateTime.DATETIME_MED })}`}
          </div>
        )}
      </div>
    </Link>
  )
}

export default VesselListItem
