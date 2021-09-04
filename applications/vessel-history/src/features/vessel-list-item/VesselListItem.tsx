import React, { Fragment } from 'react'
import Link from 'redux-first-router-link'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'
import { IconButton } from '@globalfishingwatch/ui-components'
import { VesselSearch as Vessel } from '@globalfishingwatch/api-types'
import { DEFAULT_EMPTY_VALUE } from 'data/config'
import { useVesselsConnect } from 'features/vessels/vessels.hook'
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
  const { formatSource } = useVesselsConnect()

  if (!vessel) {
    return <div></div>
  }

  const flagLabel = getFlagById(vessel.flag)?.label
  const sourceAPI = getVesselAPISource(vessel)

  return (
    <Fragment>
      {props.saved && onDeleteClick && (
        <IconButton
          type="warning"
          size="default"
          icon="delete"
          className={styles.remove}
          onClick={onDeleteClick}
        ></IconButton>
      )}
      <Link
        to={['profile', vessel.dataset ?? 'NA', vessel.id ?? 'NA', vessel.vesselMatchId ?? 'NA']}
        className={styles.vesselItem}
      >
        <h3>{vessel?.shipname ?? DEFAULT_EMPTY_VALUE}</h3>
        <div className={styles.identifiers}>
          <div>
            <label>{t('vessel.flag', 'flag')}</label>
            {flagLabel ?? DEFAULT_EMPTY_VALUE}
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
              {sourceAPI.map((source) => formatSource(source)).join('+') ?? DEFAULT_EMPTY_VALUE}
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
                  DEFAULT_EMPTY_VALUE
                )}{' '}
                {t('common.to', 'to')}{' '}
                {vessel.lastTransmissionDate ? (
                  <I18nDate date={vessel.lastTransmissionDate} />
                ) : (
                  DEFAULT_EMPTY_VALUE
                )}
              </Fragment>
            ) : (
              DEFAULT_EMPTY_VALUE
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
    </Fragment>
  )
}

export default VesselListItem
