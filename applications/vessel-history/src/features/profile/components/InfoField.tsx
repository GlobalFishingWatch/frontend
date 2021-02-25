import React, { useCallback, useState } from 'react'
import { Icon, Modal } from '@globalfishingwatch/ui-components'
// eslint-disable-next-line import/order
import { VesselInfoValue } from 'classes/vessel.class'
import styles from './Info.module.css'
import InfoFieldHistoric from './InfoFieldHistoric'

interface ListItemProps {
  label: string
  field: VesselInfoValue
}

const InfoField: React.FC<ListItemProps> = (props): React.ReactElement => {
  const field = props.field
  const [modalOpen, setModalOpen] = useState(false)
  const displachOpenModal = useCallback((field: VesselInfoValue) => {
    setModalOpen(true)
  }, [])

  if (!field.value?.data) {
    return <div></div>
  }

  return (
    <div className={styles.identifierField}>
      <label>{props.label}</label>
      <span onClick={() => displachOpenModal(field)}>
        {field.value?.data}
        {field.value?.historic.length && <Icon icon="search"></Icon>}
      </span>
      {field.value?.historic.length && (
        <Modal
          title={props.label + ' Historic Values'}
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false)
          }}
        >
          <InfoFieldHistoric historic={field.value.historic}></InfoFieldHistoric>
        </Modal>
      )}
    </div>
  )
}

export default InfoField
