import React, { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '@globalfishingwatch/ui-components'
import { DEFAULT_EMPTY_VALUE } from 'data/config'
import { ValueItem } from 'types'
import I18nDate from 'features/i18n/i18nDate'
import { VesselFieldLabel } from './InfoField'
import styles from './Info.module.css'

interface ListItemProps {
  current: ValueItem
  history: ValueItem[]
  isOpen: boolean
  label: VesselFieldLabel
  vesselName: string
  onClose?: () => void
}

const InfoFieldHistory: React.FC<ListItemProps> = ({
  current,
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

  const since = useMemo(
    () => current?.firstSeen ?? history.slice(0, 1)?.shift()?.firstSeen,
    [current, history]
  )

  const previousHistory = useMemo(() => history.slice(1), [history])

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
              <div className={styles.identifierField}>
                <label>{t(`vessel.${label}` as any, label)}</label>
                <div>{current.value}</div>
              </div>
              <div className={styles.identifierField}>
                <label>{t('common.currentTimeRange', 'CURRENT TIME RANGE')}</label>
                <div>
                  <span className={styles.rangeLabel}>{t('common.since', 'Since')}: </span>
                  <span className={styles.rangeValue}>{since && <I18nDate date={since} />}</span>
                  <span className={styles.rangeValue}>{!since && DEFAULT_EMPTY_VALUE}</span>
                </div>
              </div>
            </div>
            {previousHistory.map((historyValue: ValueItem, index) => (
              <div className={styles.historyItem} key={index}>
                <div className={styles.identifierField}>
                  <label>{t(`vessel.${label}` as any, label)}</label>
                  <div>{historyValue.value}</div>
                </div>
                <div className={styles.identifierField}>
                  <label>{t('common.timeRange', 'Time Range')}</label>
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </Fragment>
  )
}

export default InfoFieldHistory
