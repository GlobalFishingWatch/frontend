import React, { useCallback, useState } from 'react'
// eslint-disable-next-line import/order
import { HistoricValue, VesselInfoValue } from 'classes/vessel.class'
import styles from './Info.module.css'
import InfoFieldHistoric from './InfoFieldHistoric'

interface ListItemProps {
  label: string
  field: VesselInfoValue
  vesselName: string
}

const InfoField: React.FC<ListItemProps> = ({ field, label, vesselName }): React.ReactElement => {
  const [modalOpen, setModalOpen] = useState(false)
  const displachOpenModal = useCallback((field: VesselInfoValue) => {
    setModalOpen(true)
  }, [])

  if (!field.value?.data) {
    return <div></div>
  }

  const current: HistoricValue = {
    data: field.value?.data,
    start: field.value.historic.slice().shift()?.end || null,
    end: null,
  }
  return (
    <div className={styles.identifierField}>
      <label>{label}</label>
      <div onClick={() => displachOpenModal(field)}>
        {field.value?.data}
        <InfoFieldHistoric
          current={current}
          label={label}
          historic={field.value.historic}
          isOpen={modalOpen}
          vesselName={vesselName}
        ></InfoFieldHistoric>
      </div>
    </div>
  )
}

export default InfoField
