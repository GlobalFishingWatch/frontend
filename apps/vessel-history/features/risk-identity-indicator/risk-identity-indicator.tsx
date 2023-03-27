import { useCallback, useMemo, useState } from 'react'
import { event as uaEvent } from 'react-ga'
import { IconButton } from '@globalfishingwatch/ui-components'
import InfoFieldHistory from 'features/profile/components/InfoFieldHistory'
import { ValueItem } from 'types'
import { VesselFieldLabel } from 'types/vessel'
import { getUniqueHistoryValues } from 'features/vessels/activity/vessels-activity.utils'
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

  const uniqueValues = useMemo(() => getUniqueHistoryValues(history), [history])
  const autoSubtitle = useMemo(() => {
    if (subtitle) return
    return `(${uniqueValues.join(', ')})`
  }, [uniqueValues, subtitle])
  const hasHistory = history.length > 0

  const openModal = useCallback(() => {
    if (hasHistory) {
      uaEvent({
        category: 'Vessel Detail RISK SUMMARY Tab',
        action: `View list of events or details of a risk indicator`,
        label: JSON.stringify({ field }),
      })
      setModalOpen(true)
    }
  }, [hasHistory, field])
  const closeModal = useCallback(() => setModalOpen(false), [])

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
      {hasHistory && (
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
