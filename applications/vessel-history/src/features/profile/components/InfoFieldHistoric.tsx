import React, { Fragment, useCallback, useState } from 'react'
import { DateTime } from 'luxon'
import { Modal } from '@globalfishingwatch/ui-components'
// eslint-disable-next-line import/order
import { HistoricValue } from 'classes/vessel.class'
import styles from './Info.module.css'

interface ListItemProps {
  current: HistoricValue
  historic: HistoricValue[]
  isOpen: boolean
  label: string
  vesselName: string
}

const InfoFieldHistoric: React.FC<ListItemProps> = ({
  current,
  historic,
  isOpen,
  label,
  vesselName,
}): React.ReactElement => {
  const [modalOpen, setModalOpen] = useState(isOpen)
  const toggleModalOpen = useCallback(() => {
    setModalOpen(!modalOpen)
  }, [])

  const formatedDate = (date: DateTime | null) => {
    return date ? [date.toLocaleString(DateTime.DATETIME_MED), 'UTC'].join(' ') : ''
  }

  if (historic.length < 1) {
    return <div></div>
  }

  return (
    <Fragment>
      <div onClick={toggleModalOpen}>{`+${historic.length + 1} previous ${label}s`}</div>

      {historic.length && (
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
            {historic.map((historicValue: HistoricValue, index) => (
              <Fragment key={index}>
                <div className={styles.identifierField}>
                  <label>{label}</label>
                  <div>{historicValue.data}</div>
                </div>
                <div className={styles.identifierField}>
                  <label>Time Range</label>
                  <div>
                    {historicValue.start && <div>From {formatedDate(historicValue.start)}</div>}
                    {historicValue.end && <div>To {formatedDate(historicValue.end)}</div>}
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

export default InfoFieldHistoric
