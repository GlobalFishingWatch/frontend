import React, { Fragment, useCallback, useState } from 'react'
import { DateTime } from 'luxon'
import { Modal } from '@globalfishingwatch/ui-components'
// eslint-disable-next-line import/order
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
  const [modalOpen, setModalOpen] = useState(isOpen)
  const toggleModalOpen = useCallback(() => {
    setModalOpen(!modalOpen)
  }, [modalOpen])

  const formatedDate = (date: DateTime | null) => {
    return date ? [date.toLocaleString(DateTime.DATETIME_MED), 'UTC'].join(' ') : ''
  }

  if (history.length < 1) {
    return <div></div>
  }

  return (
    <Fragment>
      <button className={styles.moreValues} onClick={toggleModalOpen}>{`+${
        history.length + 1
      } previous ${label}s`}</button>

      {history.length && (
        <Modal
          title={label + ' History for ' + vesselName}
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false)
          }}
        >
          <div>
            <div className={styles.identifierField}>
              <label>{label}</label>
              <div>{current.data}</div>
            </div>
            <div className={styles.identifierField}>
              <label>CURRENT TIME RANGE</label>
              <div>Since {formatedDate(current.start)}</div>
            </div>
            {history.map((historyValue: historyValue, index) => (
              <Fragment key={index}>
                <div className={styles.identifierField}>
                  <label>{label}</label>
                  <div>{historyValue.data}</div>
                </div>
                <div className={styles.identifierField}>
                  <label>Time Range</label>
                  <div>
                    {historyValue.start && <div>From {formatedDate(historyValue.start)}</div>}
                    {historyValue.end && <div>To {formatedDate(historyValue.end)}</div>}
                  </div>
                </div>
              </Fragment>
            ))}
          </div>
        </Modal>
      )}
    </Fragment>
  )
}

export default InfoFieldHistory
