import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { InputDate, InputText, Select, SelectOption } from '@globalfishingwatch/ui-components'
import { useReportTimeCompareConnect } from 'features/area-report/reports-timecomparison.hooks'
import { selectActiveActivityAndDetectionsDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { getSourcesSelectedInDataview } from 'features/workspace/activity/activity.utils'
import { selectReportAreaIds } from 'features/area-report/reports.selectors'
import { selectDatasetAreaDetail } from 'features/areas/areas.slice'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { MAX_MONTHS_TO_COMPARE, MAX_DAYS_TO_COMPARE } from 'features/area-report/reports.config'
import { selectReportTimeComparison } from '../reports.config.selectors'
import styles from './ReportActivityBeforeAfter.module.css'

export default function ReportActivityBeforeAfter() {
  const { t } = useTranslation()
  const timeComparison = useSelector(selectReportTimeComparison)
  const dataviews = useSelector(selectActiveActivityAndDetectionsDataviews)
  const reportAreaIds = useSelector(selectReportAreaIds)
  const reportArea = useSelector(selectDatasetAreaDetail(reportAreaIds))
  const {
    onCompareStartChange,
    onDurationChange,
    onDurationTypeSelect,
    durationTypeOption,
    durationTypeOptions,
    MIN_DATE,
    MAX_DATE,
  } = useReportTimeCompareConnect('beforeAfter')

  const trackAndChangeDate = (date: any) => {
    trackEvent({
      category: TrackCategory.Analysis,
      action: `Select date in 'before/after'`,
      label: JSON.stringify({
        date: date.target.value,
        regionName: reportArea.name,
        sourceNames: dataviews.flatMap((dataview) =>
          getSourcesSelectedInDataview(dataview).map((source) => source.label)
        ),
      }),
    })
    onCompareStartChange(date)
  }

  const trackAndChangeDuration = (duration: any) => {
    trackEvent({
      category: TrackCategory.Analysis,
      action: `Select duration in 'before/after'`,
      label: JSON.stringify({
        duration: duration.target.value + ' ' + durationTypeOption?.label,
        durationAmount: duration.target.value,
        durationType: durationTypeOption?.label,
        regionName: reportArea.name,
        sourceNames: dataviews.flatMap((dataview) =>
          getSourcesSelectedInDataview(dataview).map((source) => source.label)
        ),
      }),
    })
    onDurationChange(duration)
  }

  const trackAndChangeDurationType = (duration: SelectOption) => {
    trackEvent({
      category: TrackCategory.Analysis,
      action: `Select duration in 'before/after'`,
      label: JSON.stringify({
        duration: timeComparison?.duration + ' ' + duration.label,
        durationAmount: timeComparison?.duration,
        durationType: duration.label,
        regionName: reportArea.name,
        sourceNames: dataviews.flatMap((dataview) =>
          getSourcesSelectedInDataview(dataview).map((source) => source.label)
        ),
      }),
    })
    onDurationTypeSelect(duration)
  }

  return (
    <div className={styles.container}>
      <div className={styles.timeSelection}>
        <div className={styles.dateWrapper}>
          <InputDate
            label={t('analysis.beforeAfterDate', 'date')}
            onChange={trackAndChangeDate}
            value={timeComparison?.compareStart}
            min={MIN_DATE}
            max={MAX_DATE}
          />
        </div>
        <div className={styles.durationWrapper}>
          <InputText
            label={t('analysis.periodComparisonDuration', 'duration')}
            value={timeComparison?.duration}
            type="number"
            onChange={trackAndChangeDuration}
            className={styles.duration}
            min={1}
            max={
              timeComparison?.durationType === 'months'
                ? MAX_MONTHS_TO_COMPARE
                : MAX_DAYS_TO_COMPARE
            }
          />
          {durationTypeOption && (
            <Select
              options={durationTypeOptions}
              onSelect={trackAndChangeDurationType}
              className={styles.durationType}
              selectedOption={durationTypeOption}
            />
          )}
        </div>
      </div>
    </div>
  )
}
