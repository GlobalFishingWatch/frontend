import React, { Fragment, ReactNode, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { DEFAULT_EMPTY_VALUE } from 'data/config'
import { useVesselsConnect } from 'features/vessels/vessels.hook'
import { ValueItem } from 'types'
import { VesselFieldLabel } from 'types/vessel'
import HistoryDate from './HistoryDate'
import styles from './Info.module.css'

interface HistoryProps {
  history: ValueItem[]
  label: VesselFieldLabel
  columnHeaders?: {
    field?: ReactNode
    dates?: ReactNode
    source?: ReactNode
  }
  hideTMTDate: boolean
  filterRange?: {
    start: Date,
    end: Date
  }
}

const InfoFieldHistory: React.FC<HistoryProps> = ({
  history,
  label,
  columnHeaders,
  hideTMTDate,
  filterRange
}): React.ReactElement => {
  const { t } = useTranslation()

  const { formatSource } = useVesselsConnect(label)

  const filteredHistory = filterRange ? history.filter(historyValue => {
    const start = new Date(historyValue.firstSeen)
    if (start && start > filterRange.start && start < filterRange.end) {
      return true
    }
    const end = new Date(historyValue.endDate)
    if (end && end > filterRange.end && end < filterRange.end) {
      return true
    }
    if (start && start < filterRange.start && !end) {
      return true
    }
    if (start && end && start < filterRange.start && end > filterRange.end) {
      return true
    }

    return false
  }
  ) : history
  return (
    <Fragment>
      {filteredHistory.length > 0 && (
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

          {filteredHistory.map((historyValue: ValueItem, index) => (
            <div className={styles.historyItem} key={index}>
              <div className={styles.identifierField}>
                {historyValue.value ? historyValue.value : DEFAULT_EMPTY_VALUE}
              </div>
              {!hideTMTDate && (
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

export default InfoFieldHistory
