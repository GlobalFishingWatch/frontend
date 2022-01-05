import React, { Fragment, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { event as uaEvent } from 'react-ga'
import { InputDate, InputText, Select, Spinner } from '@globalfishingwatch/ui-components'
import { selectAnalysisTimeComparison } from 'features/app/app.selectors'
import { selectDataviewInstancesByIds } from 'features/dataviews/dataviews.selectors'
import { getSourcesSelectedInDataview } from 'features/workspace/activity/activity.utils'
import Hint from 'features/help/hints/Hint'
import { COLOR_PRIMARY_BLUE } from 'features/app/App'
import AnalysisLayerPanel from 'features/analysis/AnalysisLayerPanel'
import { AnalysisTypeProps } from './Analysis'
import useAnalysisDescription, { FIELDS } from './analysisDescription.hooks'
import AnalysisDescription from './AnalysisDescription'
import {
  DURATION_TYPES_OPTIONS,
  MAX_DAYS_TO_COMPARE,
  MAX_MONTHS_TO_COMPARE,
  useAnalysisTimeCompareConnect,
} from './analysis.hooks'
import AnalysisPeriodComparisonGraph from './AnalysisPeriodComparisonGraph'
import styles from './AnalysisPeriodComparison.module.css'
import { selectTimeComparisonValues } from './analysis.selectors'

const AnalysisPeriodComparison: React.FC<AnalysisTypeProps> = (props) => {
  const { layersTimeseriesFiltered, analysisAreaName } = props
  const { t } = useTranslation()
  const timeComparison = useSelector(selectAnalysisTimeComparison)
  const timeComparisonValues = useSelector(selectTimeComparisonValues)
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

  const trackAndChangeComparisonDate = useCallback((date) => {
    uaEvent({
      category: 'Analysis',
      action: `Select comparison date in 'period comparison'`,
      label: JSON.stringify({
        date: date.target.value,
        regionName: analysisAreaName,
        sourceNames: dataviews.flatMap(dataview => getSourcesSelectedInDataview(dataview).map(source => source.label))
      })
    })
    onCompareStartChange(date)
  }, [onCompareStartChange])

  const trackAndChangeBaselineDate = useCallback((date) => {
    uaEvent({
      category: 'Analysis',
      action: `Select baseline date in 'period comparison'`,
      label: JSON.stringify({
        date: date.target.value,
        regionName: analysisAreaName,
        sourceNames: dataviews.flatMap(dataview => getSourcesSelectedInDataview(dataview).map(source => source.label))
      })
    })
    onStartChange(date)
  }, [onStartChange])

  const trackAndChangeDuration = useCallback((duration) => {
    uaEvent({
      category: 'Analysis',
      action: `Select duration in 'period comparison'`,
      label: JSON.stringify({
        duration: duration.target.value + ' ' + durationTypeOption.label,
        regionName: analysisAreaName,
        sourceNames: dataviews.flatMap(dataview => getSourcesSelectedInDataview(dataview).map(source => source.label))
      })
    })
    onDurationChange(duration)
  }, [onCompareStartChange])

  const trackAndChangeDurationType = useCallback((duration) => {
    uaEvent({
      category: 'Analysis',
      action: `Select duration in 'period comparison'`,
      label: JSON.stringify({
        duration: timeComparison.duration + ' ' + duration.label,
        regionName: analysisAreaName,
        sourceNames: dataviews.flatMap(dataview => getSourcesSelectedInDataview(dataview).map(source => source.label))
      })
    })
    onDurationTypeSelect(duration)
  }, [onCompareStartChange])

  const { description, commonProperties } = useAnalysisDescription(
    analysisAreaName,
    layersTimeseriesFiltered?.[0]
  )
  const dataviewsIds = useMemo(() => {
    if (!layersTimeseriesFiltered) return []
    return layersTimeseriesFiltered[0].sublayers.map((s) => s.id)
  }, [layersTimeseriesFiltered])
  const dataviews = useSelector(selectDataviewInstancesByIds(dataviewsIds))

  if (!timeComparison) return null

  const isLoading =
    !layersTimeseriesFiltered ||
    !layersTimeseriesFiltered[0] ||
    !layersTimeseriesFiltered[0].timeseries

  return (
    <Fragment>
      <AnalysisDescription description={description} />
      <div className={styles.layerPanel}>
        {dataviews &&
          dataviews.map((dataview, index) => (
            <AnalysisLayerPanel
              key={dataview.id}
              dataview={dataview}
              index={index}
              hiddenProperties={commonProperties}
              hideColors={true}
              availableFields={FIELDS}
            />
          ))}
      </div>
      {isLoading ? (
        <div className={styles.graphContainer}>
          <Spinner />
        </div>
      ) : (
        <AnalysisPeriodComparisonGraph
          graphData={layersTimeseriesFiltered?.[0]}
          start={timeComparison.start}
          end={timeComparisonValues.end}
        />
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
                  onRemove={() => { }}
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
