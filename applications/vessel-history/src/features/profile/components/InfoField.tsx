import React, { useCallback, useState } from 'react'
import { ValueItem } from 'types'
import { useTranslation } from 'utils/i18n'
import styles from './Info.module.css'
import InfoFieldHistory from './InfoFieldHistory'

interface ListItemProps {
  label: string
  value: string
  valuesHistory?: ValueItem[]
  vesselName: string
}

const InfoField: React.FC<ListItemProps> = ({
  value = '',
  label,
  valuesHistory = [],
  vesselName,
}): React.ReactElement => {
  const { t } = useTranslation()

  const [modalOpen, setModalOpen] = useState(false)
  const openModal = useCallback(() => setModalOpen(true), [])
  const closeModal = useCallback(() => setModalOpen(false), [])

  const defaultEmptyValue = '-'

  const current: ValueItem = {
    value,
    firstSeen: valuesHistory.slice().shift()?.endDate,
  }
  return (
    <div className={styles.identifierField}>
      <label>{label}</label>
      <div>
        <div onClick={openModal}>{value.length > 0 ? value : defaultEmptyValue}</div>
        {valuesHistory.length > 0 && (
          <button className={styles.moreValues} onClick={openModal}>{`+${valuesHistory.length} ${t(
            'common.previous',
            'previous'
          )} ${t(`common.${label}Plural`, `${label}s`)}`}</button>
        )}
        <InfoFieldHistory
          current={current}
          label={label}
          history={valuesHistory}
          isOpen={modalOpen}
          onClose={closeModal}
          vesselName={vesselName}
        ></InfoFieldHistory>
      </div>
    </div>
  )
}

export default InfoField
