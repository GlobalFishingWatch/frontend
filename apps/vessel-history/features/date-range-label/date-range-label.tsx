import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { DateTime, Duration } from 'luxon'

import { useNavigatorOnline } from '@globalfishingwatch/react-hooks'
import type { ButtonType } from '@globalfishingwatch/ui-components';
import { Button } from '@globalfishingwatch/ui-components'

import { AIS_DATA_DELAY_DAYS, RISK_SUMMARY_SETTINGS } from 'data/config'
import type { Filters } from 'features/event-filters/filters.slice'
import FiltersLabel from 'features/filters-label/filters-label'
import { selectCurrentOfflineVessel } from 'features/vessels/offline-vessels.selectors'
import { getUTCDateTime } from 'utils/dates'

import styles from './date-range-label.module.css'

export interface DateRangeLabelProps {
  className?: string
  type?: ButtonType
}

export function DateRangeLabel({ className, type }: DateRangeLabelProps) {
  const { online } = useNavigatorOnline()
  const offlineVessel = useSelector(selectCurrentOfflineVessel)

  const filters: Partial<Filters> = useMemo(() => {
    const endDate = (
      (!online && offlineVessel?.savedOn && getUTCDateTime(offlineVessel.savedOn)) ||
      DateTime.utc()
    ).minus(Duration.fromObject({ days: AIS_DATA_DELAY_DAYS }))
    const startDate = endDate.minus(RISK_SUMMARY_SETTINGS.timeRange)

    return {
      start: startDate.toUTC().toISO() as string,
      end: endDate.toUTC().toISO() as string,
    }
  }, [offlineVessel?.savedOn, online])

  return (
    <Button type={type ?? 'secondary'} className={cx(styles.filterBtn, className)}>
      <FiltersLabel filters={filters} />
    </Button>
  )
}

export default DateRangeLabel
