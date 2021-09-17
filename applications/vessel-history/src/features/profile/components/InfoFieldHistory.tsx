import React, { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '@globalfishingwatch/ui-components'
import { DEFAULT_EMPTY_VALUE } from 'data/config'
import { useVesselsConnect } from 'features/vessels/vessels.hook'
import { ValueItem, VesselAPISource } from 'types'
import I18nDate from 'features/i18n/i18nDate'
import { VesselFieldLabel } from './InfoField'
import styles from './Info.module.css'

interface ListItemProps {
  history: ValueItem[]
  isOpen: boolean
  label: VesselFieldLabel
  hideTMTDate: boolean
  vesselName: string
  onClose?: () => void
}

const InfoFieldHistory: React.FC<ListItemProps> = ({
  history,
  isOpen,
  label,
  hideTMTDate,
  vesselName,
  onClose = () => void 0,
}): React.ReactElement => {
  const { t } = useTranslation()

  const defaultTitle = useMemo(() => {
    return `${label} History for ${vesselName}`
  }, [label, vesselName])
  
  const hasGFWValues = useMemo(() => {
    return history.some(value => value.source === VesselAPISource.GFW)
  }, [history])
  const { formatSource } = useVesselsConnect()
  
  if (history.length < 1) {
    return <div></div>
  }

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
              {(hasGFWValues || !hideTMTDate) && (
                <label className={styles.identifierField}>
                  {t('common.timeRange', 'time range')} 
                </label>
              )}
              <label className={styles.identifierField}>{t(`vessel.source`, 'source')}</label>
            </div>

            {history.map((historyValue: ValueItem, index) => (
              <div className={styles.historyItem} key={index}>
                <div className={styles.identifierField}>
                  {historyValue.value ? historyValue.value : DEFAULT_EMPTY_VALUE}
                </div>
                {(hasGFWValues || !hideTMTDate) && (
                  <div className={styles.identifierField}>
                    {!hideTMTDate || historyValue.source === VesselAPISource.GFW && 
                      <div>
                        {historyValue.firstSeen && (
                          <div>
                          <span className={styles.rangeLabel}>{t('common.from', 'From')}: </span>
                            <span className={styles.rangeValue}>
                              <I18nDate date={historyValue.firstSeen} />
                              </span>
                          </div>
                          )}
                        {historyValue.endDate && (
                          <div>
                          <span className={styles.rangeLabel}>{t('common.to', 'To')}: </span>
                            <span className={styles.rangeValue}>
                            <I18nDate date={historyValue.endDate} />
                            </span>
                            </div>
                            )}
                        {!historyValue.firstSeen && !historyValue.endDate && (
                          <Fragment>{DEFAULT_EMPTY_VALUE}</Fragment>
                        )}
                    </div>
                    }
                  </div>
                )}
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
