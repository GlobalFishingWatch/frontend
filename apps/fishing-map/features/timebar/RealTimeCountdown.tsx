import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'

import { Tooltip } from '@globalfishingwatch/ui-components'

import { REAL_TIME_DATA_UPDATE_INTERVAL_MS } from 'data/config'
import { formatI18nDate } from 'features/i18n/i18nDate.utils'
import { getMsUntilNextRealTimeUpdate } from 'utils/dates'

import styles from './RealTimeCountdown.module.css'

const SIZE = 16
const STROKE = 2
const RADIUS = (SIZE - STROKE) / 2

export function RealTimeCountdown() {
  const { t } = useTranslation()
  const elapsedMs = useMemo(
    () => REAL_TIME_DATA_UPDATE_INTERVAL_MS - getMsUntilNextRealTimeUpdate(),
    []
  )
  const nextUpdate = DateTime.utc().plus({ milliseconds: getMsUntilNextRealTimeUpdate() })
  const tooltip = t((t) => t.timebar.nextRealTimeUpdate, {
    time: formatI18nDate(nextUpdate.toISO() as string, {
      format: DateTime.TIME_SIMPLE,
      showUTCLabel: true,
    }),
  })

  return (
    <Tooltip content={tooltip}>
      <svg className={styles.ring} width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <circle
          className={styles.track}
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          strokeWidth={STROKE}
          fill="none"
        />
        <circle
          className={styles.progress}
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          strokeWidth={STROKE}
          fill="none"
          pathLength={100}
          strokeDasharray={100}
          style={{
            animationDuration: `${REAL_TIME_DATA_UPDATE_INTERVAL_MS}ms`,
            animationDelay: `-${elapsedMs}ms`,
          }}
        />
      </svg>
    </Tooltip>
  )
}

export default RealTimeCountdown
