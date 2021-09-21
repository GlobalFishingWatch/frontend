import React, { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '@globalfishingwatch/ui-components'
import { DEFAULT_EMPTY_VALUE } from 'data/config'
import { useVesselsConnect } from 'features/vessels/vessels.hook'
import { ValueItem } from 'types'
import HistoryDate from './HistoryDate'
import { VesselFieldLabel } from './InfoField'
import styles from './Info.module.css'

interface ListItemProps {
  history: ValueItem[]
  isOpen: boolean
  label: VesselFieldLabel
  vesselName: string
  onClose?: () => void
}

const InfoFieldHistory: React.FC<ListItemProps> = ({
  history,
  isOpen,
  label,
  vesselName,
  onClose = () => void 0,
}): React.ReactElement => {
  const { t } = useTranslation()

  const defaultTitle = useMemo(() => {
    return `${label} History for ${vesselName}`
  }, [label, vesselName])

  const { formatSource } = useVesselsConnect()

  return (
    <Fragment>
      {history.length && (
        <Modal
          title={t('vessel.historyLabelByField', defaultTitle, {
            label: t(`vessel.${label}` as any, label),
            vesselName,
          })}
          isOpen={isOpen}
          onClose={onClose}
        >
          <div>
            <div className={styles.historyItem}>
              <label className={styles.identifierField}>{t(`vessel.${label}` as any, label)}</label>
              <label className={styles.identifierField}>
                {t('common.timeRange', 'time range')}
              </label>
              <label className={styles.identifierField}>{t(`vessel.source`, 'source')}</label>
            </div>

            {history.map((historyValue: ValueItem, index) => (
              <div className={styles.historyItem} key={index}>
                <div className={styles.identifierField}>
                  {historyValue.value ? historyValue.value : DEFAULT_EMPTY_VALUE}
                </div>
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
                <div className={styles.identifierField}>{formatSource(historyValue.source)}</div>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </Fragment>
  )
}

export default InfoFieldHistory
