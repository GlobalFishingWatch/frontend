import { Fragment, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { event as uaEvent } from 'react-ga'
import { InputDate, InputText, Select, Spinner } from '@globalfishingwatch/ui-components'
import { selectAnalysisTimeComparison } from 'features/app/app.selectors'
import { selectDataviewInstancesByIds } from 'features/dataviews/dataviews.selectors'
import { getSourcesSelectedInDataview } from 'features/workspace/activity/activity.utils'
import Hint from 'features/hints/Hint'
import { COLOR_PRIMARY_BLUE } from 'features/app/App'
import AnalysisRow from 'features/analysis/AnalysisRow'
import { AnalysisTypeProps } from './Analysis'
import {
  DURATION_TYPES_OPTIONS,
  MAX_DAYS_TO_COMPARE,
  MAX_MONTHS_TO_COMPARE,
  useAnalysisTimeCompareConnect,
} from './analysis-timecomparison.hooks'
import styles from './AnalysisPeriodComparison.module.css'

const AnalysisPeriodComparison: React.FC<AnalysisTypeProps> = (props) => {
  const { layersTimeseriesFiltered, analysisAreaName, loading, blur } = props
  const { t } = useTranslation()
  const timeComparison = useSelector(selectAnalysisTimeComparison)
  const {
    onStartChange,
    onCompareStartChange,
    onDurationChange,
    onDurationTypeSelect,
    durationTypeOption,
    errorMsg,
    MIN_DATE,
    MAX_DATE,
  } = useAnalysisTimeCompareConnect('periodComparison')
  const dataviewsIds = useMemo(() => {
    if (!layersTimeseriesFiltered?.[0]?.sublayers) return []
    return layersTimeseriesFiltered[0]?.sublayers.map((s) => s.id)
  }, [layersTimeseriesFiltered])
  const dataviews = useSelector(selectDataviewInstancesByIds(dataviewsIds))

  const trackAndChangeComparisonDate = useCallback(
    (date) => {
      uaEvent({
        category: 'Analysis',
        action: `Select comparison date in 'period comparison'`,
        label: JSON.stringify({
          date: date.target.value,
          regionName: analysisAreaName,
          sourceNames: dataviews.flatMap((dataview) =>
            getSourcesSelectedInDataview(dataview).map((source) => source.label)
          ),
        }),
      })
      onCompareStartChange(date)
    },
    [analysisAreaName, dataviews, onCompareStartChange]
  )

  const trackAndChangeBaselineDate = (date) => {
    uaEvent({
      category: 'Analysis',
      action: `Select baseline date in 'period comparison'`,
      label: JSON.stringify({
        date: date.target.value,
        regionName: analysisAreaName,
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
        regionName: analysisAreaName,
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
        regionName: analysisAreaName,
        sourceNames: dataviews.flatMap((dataview) =>
          getSourcesSelectedInDataview(dataview).map((source) => source.label)
        ),
      }),
    })
    onDurationTypeSelect(duration)
  }

  if (!timeComparison) return null

  const showSpinner = loading && (!blur || !layersTimeseriesFiltered)

  return (
    <Fragment>
      {showSpinner ? (
        <div className={styles.graphContainer}>
          <Spinner />
        </div>
      ) : (
        <Fragment>
          {layersTimeseriesFiltered?.map((layerTimeseriesFiltered, index) => {
            return (
              <AnalysisRow
                type="period-comparison"
                key={index}
                blur={blur}
                loading={loading}
                analysisAreaName={analysisAreaName}
                graphData={layerTimeseriesFiltered}
              />
            )
          })}
        </Fragment>
      )}
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
                  options={DURATION_TYPES_OPTIONS}
                  onSelect={trackAndChangeDurationType}
                  className={styles.durationType}
                  selectedOption={durationTypeOption}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {errorMsg && <div className={cx(styles.container, styles.error)}>{errorMsg}</div>}
    </Fragment>
  )
}

export default AnalysisPeriodComparison
