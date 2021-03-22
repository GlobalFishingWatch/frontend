import React, { Fragment, useCallback, useState } from 'react'
import { DateTime } from 'luxon'
import { Modal } from '@globalfishingwatch/ui-components'
// eslint-disable-next-line import/order
import { useTranslation } from 'utils/i18n'
import { ValueItem } from 'types'
import styles from './Info.module.css'

interface ListItemProps {
  current: ValueItem
  history: ValueItem[]
  isOpen: boolean
  label: string
  vesselName: string
}

const InfoFieldHistory: React.FC<ListItemProps> = ({
  current,
  history,
  isOpen,
  label,
  vesselName,
}): React.ReactElement => {
  const { t } = useTranslation()
  const [modalOpen, setModalOpen] = useState(isOpen)
  const toggleModalOpen = useCallback(() => {
    setModalOpen(!modalOpen)
  }, [modalOpen])

  const formatedDate = (date: string | null = null) => {
    return date
      ? [DateTime.fromISO(date, { zone: 'UTC' }).toLocaleString(DateTime.DATETIME_MED), 'UTC'].join(
          ' '
        )
      : ''
  }

  if (history.length < 1) {
    return <div></div>
  }

  return (
    <Fragment>
      <button className={styles.moreValues} onClick={toggleModalOpen}>{`+${history.length} ${t(
        'common.previous',
        'previous'
      )} ${t(`common.${label}Plural`, `${label}s`)}`}</button>

      {history.length && (
        <Modal
          title={label + ' History for ' + vesselName}
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false)
          }}
        >
          <div>
            <div className={styles.historyItem}>
              <div className={styles.identifierField}>
                <label>{label}</label>
                <div>{current.value}</div>
              </div>
              <div className={styles.identifierField}>
                <label>{t('common.currentTimeRange', 'CURRENT TIME RANGE')}</label>
                <div>
                  {t('common.since', 'Since')}{' '}
                  {formatedDate(current.firstSeen ?? history.slice(0, 1)?.shift()?.endDate)}
                </div>
              </div>
            </div>
            {history.map((historyValue: ValueItem, index) => (
              <div className={styles.historyItem} key={index}>
                <div className={styles.identifierField}>
                  <label>{label}</label>
                  <div>{historyValue.value}</div>
                </div>
                <div className={styles.identifierField}>
                  <label>{t('common.timeRange', 'Time Range')}</label>
                  <div>
                    {historyValue.firstSeen && (
                      <div>
                        {t('common.from', 'From')} {formatedDate(historyValue.firstSeen)}
                      </div>
                    )}
                    {historyValue.endDate && <div>To {formatedDate(historyValue.endDate)}</div>}
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
