import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ValueItem } from 'types'

import { IconButton } from '@globalfishingwatch/ui-components'

import { TrackCategory,trackEvent } from 'features/app/analytics.hooks'
import HistoryDate from 'features/profile/components/HistoryDate'
import InfoFieldHistory from 'features/profile/components/InfoFieldHistory'
import { getUniqueHistoryValues } from 'features/vessels/activity/vessels-activity.utils'
import type { VesselFieldLabel } from 'types/vessel'

import styles from '../risk-identity-indicator/risk-identity-indicator.module.css'

export interface RiskIuuIndicatorProps {
  field: VesselFieldLabel
  hideTMTDate?: boolean
  history?: ValueItem[]
  subtitle?: string
  title: string
  vesselName: string
}

export function RiskIuuIndicator({
  field,
  hideTMTDate,
  history,
  subtitle,
  title,
  vesselName,
}: RiskIuuIndicatorProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const { t } = useTranslation()
  const uniqueValues = useMemo(() => getUniqueHistoryValues(history), [history])
  const autoSubtitle = useMemo(() => {
    if (subtitle) return
    return `(${uniqueValues.join(', ')})`
  }, [uniqueValues, subtitle])
  const hasHistory = history.length > 0

  const datesTemplate = (firstSeen, originalFirstSeen) => (
    <HistoryDate date={firstSeen} originalDate={originalFirstSeen} />
  )
  const openModal = useCallback(() => {
    if (hasHistory) {
      trackEvent({
        category: TrackCategory.VesselDetailRiskSummaryTab,
        action: `View list of events or details of a risk indicator`,
        label: JSON.stringify({ section: 'iuu' }),
      })
      setModalOpen(true)
    }
  }, [hasHistory])
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
          modalTitle={t(
            'vessel.iuuStatusModalTitle',
            'RFMO blacklist presence for {{vesselName}}',
            {
              vesselName: vesselName,
            }
          )}
          columnHeaders={{
            field: t('common.rmfo', 'RMFO'),
            dates: t('common.listedOn', 'Listed on'),
          }}
          onClose={closeModal}
          datesTemplate={datesTemplate}
          vesselName={vesselName}
        ></InfoFieldHistory>
      )}
    </div>
  )
}

export default RiskIuuIndicator
