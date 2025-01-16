import React, { Fragment, useCallback, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import cx from 'classnames'
import { DateTime } from 'luxon'

import type { Locale, VesselSearch as Vessel } from '@globalfishingwatch/api-types'
import { Button, IconButton, TransmissionsTimeline } from '@globalfishingwatch/ui-components'

import { DEFAULT_EMPTY_VALUE, FIRST_YEAR_OF_DATA } from 'data/config'
import { SHOW_VESSEL_API_SOURCE } from 'data/constants'
import DataAndTerminology from 'features/data-and-terminology/DataAndTerminology'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { useVesselsConnect } from 'features/vessels/vessels.hook'
import type { OfflineVessel } from 'types/vessel'
import { getFlagById } from 'utils/flags'
import { getVesselAPISource } from 'utils/vessel'

import RelatedVesselListItem from './components/RelatedVesselListItem'

import styles from './VesselListItem.module.css'

interface ListItemProps {
  saved?: string
  vessel: OfflineVessel
  selected?: boolean
  index: number
  showLabelsHelp?: boolean
  onDeleteClick?: () => void
  onVesselClick?: (vessel: Vessel) => void
}

const VesselListItem: React.FC<ListItemProps> = (props): React.ReactElement<any> => {
  const { t, i18n } = useTranslation()
  const { vessel, onDeleteClick, onVesselClick = () => {}, selected = false } = props
  const { formatSource } = useVesselsConnect()
  const onClick = useCallback(() => onVesselClick(vessel), [onVesselClick, vessel])
  const [relatedOpen, setRelatedOpen] = useState(false)
  if (!vessel) {
    return <div></div>
  }
  const flagLabel = getFlagById(vessel.flag)?.label
  const sourceAPI = getVesselAPISource(vessel)

  return (
    <div className={cx([styles.vesselItemWrapper, selected ? styles.selected : {}])}>
      <div className={styles.vesselItemDetails}>
        <div className={styles.vesselItem} onClick={onClick}>
          <h3>
            {vessel?.shipname ?? DEFAULT_EMPTY_VALUE}
            {!!props.saved && !!vessel.aka && vessel.aka.length > 0 && (
              <span>
                {' '}
                (
                {t('vessel.nVesselsMerged', '{{count}} merged', {
                  count: vessel.aka.length + 1,
                })}
                )
              </span>
            )}
          </h3>
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
            <div className={styles.transmissionField}>
              <div className={styles.label}>
                {t('vessel.transmission_plural', 'transmissions')}
                {props.showLabelsHelp && (
                  <DataAndTerminology
                    size="tiny"
                    type="default"
                    title={t('vessel.transmission_plural', 'transmissions')}
                  >
                    <Trans i18nKey="vessel.transmissionDescription">
                      AIS stands for Automatic Identification Systems. AIS is a GPS-like device that
                      large ships use to broadcast their position in order to avoid collisions. The
                      positions listed in the vessel search results refer to the number of vessel
                      positions broadcast over AIS that we have processed and matched to the search
                      result, over a period of time. For more information on how AIS data is
                      processed and caveats of our algorithms, please see our FAQs.
                    </Trans>
                  </DataAndTerminology>
                )}
              </div>
              {vessel.firstTransmissionDate || vessel.lastTransmissionDate ? (
                <Fragment>
                  {t(
                    'vessel.transmissionRange',
                    '{{transmissions}} AIS transmissions from {{start}} to {{end}}',
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
              locale={i18n.language as Locale}
            />
          )}
          {vessel.relatedVessels?.length > 1 && (
            <Fragment>
              <div className={styles.relatedVesselNotification}>
                {t(
                  'vessel.relatedNotification',
                  'This vessel is the combination of {{amount}} results',
                  {
                    amount: vessel.relatedVessels.length,
                  }
                )}
              </div>
              {!relatedOpen && (
                <Button
                  className={styles.fullWidth}
                  type="secondary"
                  size="default"
                  onClick={() => setRelatedOpen(true)}
                >
                  {t('search.viewIndividual', 'VIEW INDIVIDUAL RESULTS')}
                </Button>
              )}
              {relatedOpen &&
                vessel.relatedVessels.map((relatedVessel, index) => (
                  <RelatedVesselListItem
                    key={index}
                    vessel={relatedVessel}
                    index={index}
                    //onVesselClick={onVesselClick(index)}
                    selected={selected}
                  ></RelatedVesselListItem>
                ))}
              {relatedOpen && (
                <Button
                  className={styles.fullWidth}
                  type="secondary"
                  size="default"
                  onClick={() => setRelatedOpen(false)}
                >
                  {t('search.hideIndividual', 'HIDE INDIVIDUAL RESULTS')}
                </Button>
              )}
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

export default VesselListItem
