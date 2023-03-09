import React from 'react'
import { useTranslation } from 'react-i18next'
import { event as uaEvent } from 'react-ga'
import { useSelector } from 'react-redux'
import { InputDate, InputText, Select } from '@globalfishingwatch/ui-components'
import { ReportGraphProps } from 'features/reports/reports-timeseries.hooks'
import ReportActivityPeriodComparisonGraph from 'features/reports/ReportActivityPeriodComparisonGraph'
import {
  MAX_DAYS_TO_COMPARE,
  MAX_MONTHS_TO_COMPARE,
  useReportTimeCompareConnect,
} from 'features/reports/reports-timecomparison.hooks'
import { selectReportTimeComparison } from 'features/app/app.selectors'
import { selectActiveHeatmapDataviews } from 'features/dataviews/dataviews.selectors'
import { getSourcesSelectedInDataview } from 'features/workspace/activity/activity.utils'
import { selectReportAreaIds } from 'features/reports/reports.selectors'
import { selectDatasetAreaDetail } from 'features/areas/areas.slice'
import Hint from 'features/hints/Hint'
import { COLOR_PRIMARY_BLUE } from 'features/app/App'
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
    durationTypeOptions,
    onStartChange,
    onCompareStartChange,
    onDurationChange,
    onDurationTypeSelect,
    durationTypeOption,
    MIN_DATE,
    MAX_DATE,
  } = useReportTimeCompareConnect('periodComparison')

  const trackAndChangeComparisonDate = (date) => {
    uaEvent({
      category: 'Analysis',
      action: `Select comparison date in 'period comparison'`,
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

  const trackAndChangeBaselineDate = (date) => {
    uaEvent({
      category: 'Analysis',
      action: `Select baseline date in 'period comparison'`,
      label: JSON.stringify({
        date: date.target.value,
        regionName: reportArea.name,
        sourceNames: dataviews.flatMap((dataview) =>
          getSourcesSelectedInDataview(dataview).map((source) => source.label)
        ),
      }),
    })
    onStartChange(date)
  }

  const trackAndChangeDuration = (duration) => {
    uaEvent({
      category: 'Analysis',
      action: `Select duration in 'period comparison'`,
      label: JSON.stringify({
        duration: duration?.target?.value + ' ' + durationTypeOption?.label,
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
      action: `Select duration in 'period comparison'`,
      label: JSON.stringify({
        duration: timeComparison?.duration + ' ' + duration?.label,
        regionName: reportArea.name,
        sourceNames: dataviews.flatMap((dataview) =>
          getSourcesSelectedInDataview(dataview).map((source) => source.label)
        ),
      }),
    })
    onDurationTypeSelect(duration)
  }

  if (!timeComparison) return null

  return (
    <div className={styles.container}>
      {data && <ReportActivityPeriodComparisonGraph data={data} start={start} end={end} />}
      <div className={styles.timeSelection}>
        <div>
          <div className={styles.inputDateLabel}>
            <svg width="24" height="10">
              <path
                d="M 0, 5 H 18"
                stroke="rgb(111, 138, 182)"
                strokeDasharray="4 2"
                strokeWidth={2}
              ></path>
            </svg>
            <label>{t('analysis.periodComparison1st', 'Baseline start')}</label>
            <Hint id="periodComparisonBaseline" className={styles.helpHint} />
          </div>
          <InputDate
            // label={t('analysis.periodComparison1st', 'Baseline start')}
            onChange={trackAndChangeBaselineDate}
            value={timeComparison.start}
            min={MIN_DATE}
            max={timeComparison.compareStart.slice(0, 10)}
          />
        </div>
        <div>
          <div className={styles.inputDateLabel}>
            <svg width="24" height="10">
              <path
                d="M 0, 5 h 4 v 4 h 4 v -8 h 4 v 4 h 4"
                stroke={COLOR_PRIMARY_BLUE}
                strokeWidth={2}
                fill="none"
              ></path>
            </svg>
            <label>{t('analysis.periodComparison2nd', 'comparison start')}</label>
          </div>
          <InputDate
            onChange={trackAndChangeComparisonDate}
            value={timeComparison.compareStart}
            min={timeComparison.start.slice(0, 10)}
            max={MAX_DATE}
          />
        </div>
        <div>
          <div className={styles.inputDateLabel}>
            <label>{t('analysis.periodComparisonDuration', 'duration')}</label>
          </div>
          <div className={styles.durationWrapper}>
            <InputText
              min={1}
              max={
                timeComparison.durationType === 'months'
                  ? MAX_MONTHS_TO_COMPARE
                  : MAX_DAYS_TO_COMPARE
              }
              value={timeComparison.duration}
              type="number"
              onChange={trackAndChangeDuration}
              className={styles.duration}
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
    </div>
  )
}
