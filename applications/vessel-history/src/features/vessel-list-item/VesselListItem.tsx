import React, { Fragment, useCallback } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'
import { IconButton, TransmissionsTimeline } from '@globalfishingwatch/ui-components'
import { VesselSearch as Vessel } from '@globalfishingwatch/api-types'
import { DEFAULT_EMPTY_VALUE, FIRST_YEAR_OF_DATA } from 'data/config'
import { useVesselsConnect } from 'features/vessels/vessels.hook'
import { getFlagById } from 'utils/flags'
import { getVesselAPISource } from 'utils/vessel'
import { SHOW_VESSEL_API_SOURCE } from 'data/constants'
import I18nDate, { formatI18nDate, I18nDateAsString } from 'features/i18n/i18nDate'
import styles from './VesselListItem.module.css'
interface ListItemProps {
  saved?: string
  vessel: Vessel
  selected?: boolean
  index: number
  onDeleteClick?: () => void
  onVesselClick?: (vessel: Vessel) => void
}

const VesselListItem: React.FC<ListItemProps> = (props): React.ReactElement => {
  const { t } = useTranslation()
  const { vessel, onDeleteClick, onVesselClick = () => {}, selected = false } = props
  const { formatSource } = useVesselsConnect()
  const onClick = useCallback(() => onVesselClick(vessel), [onVesselClick, vessel])

  if (!vessel) {
    return <div></div>
  }
  const flagLabel = getFlagById(vessel.flag)?.label
  const sourceAPI = getVesselAPISource(vessel)

  return (
    <div className={cx([styles.vesselItemWrapper, selected ? styles.selected : {}])}>
      <div className={styles.vesselItemDetails}>
        <div className={styles.vesselItem} onClick={onClick}>
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
                {sourceAPI.map((source) => formatSource(source)).join(' + ') ?? DEFAULT_EMPTY_VALUE}
              </div>
            )}
            <div className={styles.fullWidth}>
              <label>{t('vessel.transmission_plural', 'transmissions')}</label>
              {vessel.firstTransmissionDate || vessel.lastTransmissionDate ? (
                <Fragment>
                  {t('vessel.transmissionRange', 'transmissionRange', {
                    transmissions: vessel.posCount,
                    start: vessel.firstTransmissionDate ? I18nDateAsString(vessel.firstTransmissionDate) :  DEFAULT_EMPTY_VALUE,
                    end: vessel.lastTransmissionDate ? I18nDateAsString(vessel.lastTransmissionDate) :  DEFAULT_EMPTY_VALUE,
                  })}
                </Fragment>
              ) : (
                DEFAULT_EMPTY_VALUE
              )}
            </div>
          </div>
        </div>
        <div className={styles.vesselItemActions}>
          {props.saved && onDeleteClick && (
            <IconButton
              type="warning"
              size="default"
              icon="delete"
              className={styles.remove}
              onClick={onDeleteClick}
            ></IconButton>
          )}
          {selected && (
            <IconButton
              icon="tick"
              size="default"
              className={styles.selectVessel}
              onClick={onClick}
            ></IconButton>
          )}
        </div>
        <div className={styles.vesselItemFooter}>
          {vessel.firstTransmissionDate && vessel.lastTransmissionDate && (
            <TransmissionsTimeline
              firstTransmissionDate={vessel.firstTransmissionDate}
              lastTransmissionDate={vessel.lastTransmissionDate}
              firstYearOfData={FIRST_YEAR_OF_DATA}
            />
          )}
          {props.saved && (
            <div>

              <label>{t('vessel.savedOn', 'saved on')}</label>
              {`${formatI18nDate(props.saved, { format: DateTime.DATETIME_MED })}`}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VesselListItem
