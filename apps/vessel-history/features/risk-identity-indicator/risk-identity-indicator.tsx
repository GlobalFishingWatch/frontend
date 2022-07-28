import { useCallback, useMemo, useState } from 'react'
import { IconButton } from '@globalfishingwatch/ui-components'
import InfoFieldHistory from 'features/profile/components/InfoFieldHistory'
import { ValueItem } from 'types'
import { VesselFieldLabel } from 'types/vessel'
import styles from './risk-identity-indicator.module.css'

export interface RiskIdentityIndicatorProps {
  field: VesselFieldLabel
  hideTMTDate?: boolean
  history?: ValueItem[]
  subtitle?: string
  title: string
  vesselName: string
}

export function RiskIdentityIndicator({
  field,
  hideTMTDate,
  history,
  subtitle,
  title,
  vesselName,
}: RiskIdentityIndicatorProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const openModal = useCallback(() => {
    if (history.length > 0) {
      setModalOpen(true)
    }
  }, [history.length])
  const closeModal = useCallback(() => setModalOpen(false), [])

  const autoSubtitle = useMemo(() => {
    if (subtitle) return
    const values = Array.from(new Set(history.map((item) => item.value)))
    return `(${values.join(', ')})`
  }, [history, subtitle])

  return (
    <div className={styles['container']}>
      <div className={styles.title}>
        <div>{title}</div>
        {(!!subtitle || !!autoSubtitle) && (
          <div className={styles.subtitle}> {subtitle ?? autoSubtitle}</div>
        )}
        <IconButton
          icon={'info'}
          size="small"
          className={styles.info}
          onClick={openModal}
        ></IconButton>
      </div>
      {history.length > 1 && (
        <InfoFieldHistory
          label={field}
          history={history}
          isOpen={modalOpen}
          hideTMTDate={hideTMTDate}
          onClose={closeModal}
          vesselName={vesselName}
        ></InfoFieldHistory>
      )}
    </div>
  )
}

export default RiskIdentityIndicator
