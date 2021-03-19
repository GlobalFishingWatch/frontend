import React, { useCallback, useState } from 'react'
import { ValueItem } from 'types'
import styles from './Info.module.css'
import InfoFieldHistory from './InfoFieldHistory'

interface ListItemProps {
  label: string
  value: string
  valuesHistory: ValueItem[]
  vesselName: string
}

const InfoField: React.FC<ListItemProps> = ({
  value = '',
  label,
  valuesHistory,
  vesselName,
}): React.ReactElement => {
  const [modalOpen, setModalOpen] = useState(false)
  const displachOpenModal = useCallback(() => {
    setModalOpen(true)
  }, [])

  if (!value) {
    return <div></div>
  }

  const current: ValueItem = {
    value,
    firstSeen: valuesHistory.slice().shift()?.endDate,
  }
  return (
    <div className={styles.identifierField}>
      <label>{label}</label>
      <div onClick={() => displachOpenModal()}>
        {value}
        <InfoFieldHistory
          current={current}
          label={label}
          history={valuesHistory}
          isOpen={modalOpen}
          vesselName={vesselName}
        ></InfoFieldHistory>
      </div>
    </div>
  )
}

export default InfoField
