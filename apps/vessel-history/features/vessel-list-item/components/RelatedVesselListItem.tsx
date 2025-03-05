import React, { Fragment, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'

import type { Locale, VesselSearch as Vessel, VesselSearch } from '@globalfishingwatch/api-types'
import { IconButton, TransmissionsTimeline } from '@globalfishingwatch/ui-components'

import { DEFAULT_EMPTY_VALUE, FIRST_YEAR_OF_DATA } from 'data/config'
import { formatI18nDate } from 'features/i18n/i18nDate'

import styles from '../VesselListItem.module.css'

interface RelatedVesselListItem {
  saved?: string
  vessel: VesselSearch
  selected?: boolean
  index: number
  onDeleteClick?: () => void
  onVesselClick?: (vessel: Vessel) => void
}

const RelatedVesselListItem: React.FC<RelatedVesselListItem> = (props): React.ReactElement<any> => {
  const { t, i18n } = useTranslation()
  const { vessel, onDeleteClick, onVesselClick = () => {}, selected = false } = props
  const onClick = useCallback(() => onVesselClick(vessel), [onVesselClick, vessel])

  if (!vessel) {
    return <div></div>
  }

  return (
    <div>
      <div className={styles.vesselItemDetails}>
        <div className={styles.relatedVesselItem} onClick={onClick}>
          <h3>{vessel?.shipname ?? DEFAULT_EMPTY_VALUE}</h3>
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
            <Fragment>
              <div className={styles.transmissionField}>
                <label>{t('vessel.transmission_plural', 'positions')}</label>
                {vessel.firstTransmissionDate || vessel.lastTransmissionDate ? (
                  <Fragment>
                    {t(
                      'vessel.transmissionRange',
                      '{{transmissions}} AIS positions from {{start}} to {{end}}',
                      {
                        transmissions: vessel.posCount,
                        start: vessel.firstTransmissionDate
                          ? formatI18nDate(vessel.firstTransmissionDate)
                          : DEFAULT_EMPTY_VALUE,
                        end: vessel.lastTransmissionDate
                          ? formatI18nDate(vessel.lastTransmissionDate)
                          : DEFAULT_EMPTY_VALUE,
                      }
                    )}
                  </Fragment>
                ) : (
                  DEFAULT_EMPTY_VALUE
                )}
              </div>
              <TransmissionsTimeline
                firstTransmissionDate={vessel.firstTransmissionDate}
                lastTransmissionDate={vessel.lastTransmissionDate}
                firstYearOfData={FIRST_YEAR_OF_DATA}
                locale={i18n.language as Locale}
              />
            </Fragment>
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

export default RelatedVesselListItem
