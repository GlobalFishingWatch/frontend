import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { InputDate, InputText, Select } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { COLOR_PRIMARY_BLUE } from 'features/app/app.config'
import { selectDatasetAreaDetail } from 'features/areas/areas.slice'
import { selectActiveActivityAndDetectionsDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import Hint from 'features/help/Hint'
import {
  MAX_DAYS_TO_COMPARE,
  MAX_MONTHS_TO_COMPARE,
} from 'features/reports/areas/area-reports.config'
import { selectReportTimeComparison } from 'features/reports/areas/area-reports.config.selectors'
import { selectReportAreaIds } from 'features/reports/areas/area-reports.selectors'
import { useReportTimeCompareConnect } from 'features/reports/shared/activity/reports-activity-timecomparison.hooks'
import { getSourcesSelectedInDataview } from 'features/workspace/activity/activity.utils'

import styles from './ReportActivityBeforeAfter.module.css'

export default function ReportActivityGraph() {
  const { t } = useTranslation()
  const timeComparison = useSelector(selectReportTimeComparison)
  const dataviews = useSelector(selectActiveActivityAndDetectionsDataviews)
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

  const trackAndChangeComparisonDate = (date: any) => {
    trackEvent({
      category: TrackCategory.Analysis,
      action: `Select comparison date in 'period comparison'`,
      label: JSON.stringify({
        date: date.target.value,
        regionName: reportArea?.name,
        sourceNames: dataviews.flatMap((dataview) =>
          getSourcesSelectedInDataview(dataview).map((source) => source.label)
        ),
      }),
    })
    onCompareStartChange(date)
  }

  const trackAndChangeBaselineDate = (date: any) => {
    trackEvent({
      category: TrackCategory.Analysis,
      action: `Select baseline date in 'period comparison'`,
      label: JSON.stringify({
        date: date.target.value,
        regionName: reportArea?.name,
        sourceNames: dataviews.flatMap((dataview) =>
          getSourcesSelectedInDataview(dataview).map((source) => source.label)
        ),
      }),
    })
    onStartChange(date)
  }

  const trackAndChangeDuration = (duration: any) => {
    trackEvent({
      category: TrackCategory.Analysis,
      action: `Select duration in 'period comparison'`,
      label: JSON.stringify({
        duration: duration?.target?.value + ' ' + durationTypeOption?.label,
        regionName: reportArea?.name,
        sourceNames: dataviews.flatMap((dataview) =>
          getSourcesSelectedInDataview(dataview).map((source) => source.label)
        ),
      }),
    })
    onDurationChange(duration)
  }

  const trackAndChangeDurationType = (duration: any) => {
    trackEvent({
      category: TrackCategory.Analysis,
      action: `Select duration in 'period comparison'`,
      label: JSON.stringify({
        duration: timeComparison?.duration + ' ' + duration?.label,
        regionName: reportArea?.name,
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
