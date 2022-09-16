import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import cx from 'classnames'
import { useNavigatorOnline } from '@globalfishingwatch/react-hooks'
import { Button, ButtonType } from '@globalfishingwatch/ui-components'
import { RISK_SUMMARY_SETTINGS } from 'data/config'
import { Filters } from 'features/event-filters/filters.slice'
import FiltersLabel from 'features/filters-label/filters-label'
import { selectCurrentOfflineVessel } from 'features/vessels/offline-vessels.selectors'
import styles from './date-range-label.module.css'

export interface DateRangeLabelProps {
  className?: string
  type?: ButtonType
}

export function DateRangeLabel({ className, type }: DateRangeLabelProps) {
  const { online } = useNavigatorOnline()
  const offlineVessel = useSelector(selectCurrentOfflineVessel)

  const filters: Partial<Filters> = useMemo(() => {
    const endDate =
      (!online && offlineVessel?.savedOn && DateTime.fromISO(offlineVessel.savedOn)) ||
      DateTime.now()
    const startDate = endDate.minus(RISK_SUMMARY_SETTINGS.timeRange)

    return {
      start: startDate.toUTC().toISO(),
      end: endDate.toUTC().toISO(),
    }
  }, [offlineVessel?.savedOn, online])

  return (
    <Button type={type ?? 'secondary'} className={cx(styles.filterBtn, className)}>
      <FiltersLabel filters={filters} />
    </Button>
  )
}

export default DateRangeLabel
