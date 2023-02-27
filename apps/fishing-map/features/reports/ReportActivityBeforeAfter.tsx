import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { event as uaEvent } from 'react-ga'
import { useSelector } from 'react-redux'
import { InputDate, InputText, Select } from '@globalfishingwatch/ui-components'
import { ReportGraphProps } from 'features/reports/reports-timeseries.hooks'
import ReportActivityBeforeAfterGraph from 'features/reports/ReportActivityBeforeAfterGraph'
import {
  DURATION_TYPES_OPTIONS,
  MAX_DAYS_TO_COMPARE,
  MAX_MONTHS_TO_COMPARE,
  useReportTimeCompareConnect,
} from 'features/reports/reports-timecomparison.hooks'
import { selectReportTimeComparison } from 'features/app/app.selectors'
import { selectActiveHeatmapDataviews } from 'features/dataviews/dataviews.selectors'
import { getSourcesSelectedInDataview } from 'features/workspace/activity/activity.utils'
import { selectReportAreaIds } from 'features/reports/reports.selectors'
import { selectDatasetAreaDetail } from 'features/areas/areas.slice'
import styles from './ReportActivityBeforeAfter.module.css'

type ReportActivityProps = {
  data: ReportGraphProps
  start: string
  end: string
}
export default function ReportActivityGraph({ start, end, data }: ReportActivityProps) {
  const { t } = useTranslation()
  const timeComparison = useSelector(selectReportTimeComparison)
  const dataviews = useSelector(selectActiveHeatmapDataviews)
  const reportAreaIds = useSelector(selectReportAreaIds)
  const reportArea = useSelector(selectDatasetAreaDetail(reportAreaIds))
  const {
    onCompareStartChange,
    onDurationChange,
    onDurationTypeSelect,
    durationTypeOption,
    MIN_DATE,
    MAX_DATE,
  } = useReportTimeCompareConnect('beforeAfter')

  const trackAndChangeDate = (date) => {
    uaEvent({
      category: 'Analysis',
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

  const trackAndChangeDuration = (duration) => {
    uaEvent({
      category: 'Analysis',
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

  const trackAndChangeDurationType = (duration) => {
    uaEvent({
      category: 'Analysis',
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
    <Fragment>
      <ReportActivityBeforeAfterGraph data={data} start={start} end={end} />
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
                options={DURATION_TYPES_OPTIONS}
                onSelect={trackAndChangeDurationType}
                className={styles.durationType}
                selectedOption={durationTypeOption}
              />
            )}
          </div>
        </div>
      </div>
    </Fragment>
  )
}
