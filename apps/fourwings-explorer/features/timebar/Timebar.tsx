import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Timebar } from '@globalfishingwatch/timebar'
import { DEFAULT_WORKSPACE } from 'data/config'
import { useTimerangeConnect, useURLTimerange } from 'features/timebar/timebar.hooks'
import styles from './Timebar.module.css'

const TimebarWrapper = () => {
  useURLTimerange()
  const { ready, i18n } = useTranslation()
  const { timerange, onTimebarChange } = useTimerangeConnect()
  const labels = ready ? (i18n?.getDataByLanguage(i18n.language) as any)?.timebar : undefined

  if (!timerange?.start || !timerange?.end) return null
  return (
    <div className={styles.timebarWrapper}>
      <Timebar
        enablePlayback={true}
        labels={labels}
        start={timerange?.start}
        end={timerange?.end}
        absoluteStart={DEFAULT_WORKSPACE.availableStart}
        absoluteEnd={DEFAULT_WORKSPACE.availableEnd}
        onChange={onTimebarChange}
        locale={i18n.language}
      ></Timebar>
    </div>
  )
}

export default memo(TimebarWrapper)
