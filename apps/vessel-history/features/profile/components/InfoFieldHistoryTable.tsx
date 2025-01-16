import type { JSX,ReactNode } from 'react';
import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import type { ValueItem } from 'types'

import { DEFAULT_EMPTY_VALUE } from 'data/config'
import { useVesselsConnect } from 'features/vessels/vessels.hook'
import type { VesselFieldLabel } from 'types/vessel'

import HistoryDate from './HistoryDate'

import styles from './Info.module.css'

interface ListItemProps {
  history: ValueItem[]
  label: VesselFieldLabel
  columnHeaders?: {
    field?: ReactNode
    dates?: ReactNode
    source?: ReactNode
  }
  datesTemplate?: (firstSeen, originalFirstSeen) => JSX.Element
  hideTMTDate: boolean
}

const InfoFieldHistoryTable: React.FC<ListItemProps> = ({
  history,
  label,
  datesTemplate,
  columnHeaders,
  hideTMTDate,
}): React.ReactElement<any> => {
  const { t } = useTranslation()
  const { formatSource } = useVesselsConnect(label)

  return (
    <Fragment>
      {history.length > 0 && (
        <div>
          <div className={styles.historyItem}>
            <label className={styles.identifierField}>
              {columnHeaders?.field ?? t(`vessel.${label}` as any, label)}
            </label>
            {!hideTMTDate && (
              <label className={styles.identifierField}>
                {columnHeaders?.dates ?? t('common.timeRange', 'time range')}
              </label>
            )}
            <label className={styles.identifierField}>
              {columnHeaders?.source ?? t(`vessel.source`, 'source')}
            </label>
          </div>

          {history.map((historyValue: ValueItem, index) => (
            <div className={styles.historyItem} key={index}>
              <div className={styles.identifierField}>
                {historyValue.value ? historyValue.value : DEFAULT_EMPTY_VALUE}
              </div>
              {!hideTMTDate && datesTemplate && (
                <div className={styles.identifierField}>
                  {datesTemplate(historyValue.firstSeen, historyValue.originalFirstSeen)}
                </div>
              )}
              {!hideTMTDate && !datesTemplate && (
                <div className={styles.identifierField}>
                  <div>
                    <HistoryDate
                      date={historyValue.firstSeen}
                      originalDate={historyValue.originalFirstSeen}
                      label={t('common.from', 'From')}
                    />
                    <HistoryDate
                      date={historyValue.endDate}
                      originalDate={historyValue.originalEndDate}
                      label={t('common.to', 'To')}
                    />
                    {!historyValue.firstSeen &&
                      !historyValue.endDate &&
                      !historyValue.originalFirstSeen &&
                      !historyValue.originalEndDate && <Fragment>{DEFAULT_EMPTY_VALUE}</Fragment>}
                  </div>
                </div>
              )}
              <div className={styles.identifierField}>{formatSource(historyValue.source)}</div>
            </div>
          ))}
        </div>
      )}
    </Fragment>
  )
}

export default InfoFieldHistoryTable
