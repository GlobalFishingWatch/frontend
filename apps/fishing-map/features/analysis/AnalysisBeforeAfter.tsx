import { useTranslation } from 'react-i18next'
import React, { Fragment, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { event as uaEvent } from 'react-ga'
import { InputDate, InputText, Select, Spinner } from '@globalfishingwatch/ui-components'
import { selectAnalysisTimeComparison } from 'features/app/app.selectors'
import { selectDataviewInstancesByIds } from 'features/dataviews/dataviews.selectors'
import AnalysisLayerPanel from 'features/analysis/AnalysisLayerPanel'
import { getSourcesSelectedInDataview } from 'features/workspace/activity/activity.utils'
import { AnalysisTypeProps } from './Analysis'
import styles from './AnalysisBeforeAfter.module.css'
import useAnalysisDescription, { FIELDS } from './analysisDescription.hooks'
import AnalysisDescription from './AnalysisDescription'
import {
  DURATION_TYPES_OPTIONS,
  MAX_DAYS_TO_COMPARE,
  MAX_MONTHS_TO_COMPARE,
  useAnalysisTimeCompareConnect,
} from './analysis-timecomparison.hooks'
import AnalysisBeforeAfterGraph from './AnalysisBeforeAfterGraph'
import { selectTimeComparisonValues } from './analysis.selectors'

const AnalysisBeforeAfter: React.FC<AnalysisTypeProps> = (props) => {
  const { layersTimeseriesFiltered, analysisAreaName, loading, blur } = props
  const { t } = useTranslation()
  const timeComparison = useSelector(selectAnalysisTimeComparison)
  const timeComparisonValues = useSelector(selectTimeComparisonValues)
  const {
    onCompareStartChange,
    onDurationChange,
    onDurationTypeSelect,
    durationTypeOption,
    MIN_DATE,
    MAX_DATE,
  } = useAnalysisTimeCompareConnect('beforeAfter')
  const dataviewsIds = useMemo(() => {
    if (!layersTimeseriesFiltered) return []
    return layersTimeseriesFiltered[0].sublayers.map((s) => s.id)
  }, [layersTimeseriesFiltered])
  const dataviews = useSelector(selectDataviewInstancesByIds(dataviewsIds))

  const trackAndChangeDate = (date) => {
    uaEvent({
      category: 'Analysis',
      action: `Select date in 'before/after'`,
      label: JSON.stringify({
        date: date.target.value,
        regionName: analysisAreaName,
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
      action: `Select duration in 'before/after'`,
      label: JSON.stringify({
        duration: timeComparison?.duration + ' ' + duration.label,
        durationAmount: timeComparison?.duration,
        durationType: duration.label,
        regionName: analysisAreaName,
        sourceNames: dataviews.flatMap((dataview) =>
          getSourcesSelectedInDataview(dataview).map((source) => source.label)
        ),
      }),
    })
    onDurationTypeSelect(duration)
  }

  const { description, commonProperties } = useAnalysisDescription(
    analysisAreaName,
    layersTimeseriesFiltered?.[0]
  )

  if (!timeComparison) return null

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
              availableFields={FIELDS}
              hideColors={true}
            />
          ))}
      </div>
      {loading && (!blur || !layersTimeseriesFiltered) && (
        <div className={styles.graphContainer}>
          <Spinner />
        </div>
      )}
      {layersTimeseriesFiltered && (
        <div className={blur ? styles.blur : ''}>
          <AnalysisBeforeAfterGraph
            graphData={layersTimeseriesFiltered?.[0]}
            start={timeComparison.start}
            end={timeComparisonValues.end}
          />
        </div>
      )}
      <div className={styles.container}>
        <div className={styles.timeSelection}>
          <div className={styles.dateWrapper}>
            <InputDate
              label={t('analysis.beforeAfterDate', 'date')}
              onChange={trackAndChangeDate}
              value={timeComparison.compareStart}
              min={MIN_DATE}
              max={MAX_DATE}
            />
          </div>
          <div className={styles.durationWrapper}>
            <InputText
              label={t('analysis.periodComparisonDuration', 'duration')}
              value={timeComparison.duration}
              type="number"
              onChange={trackAndChangeDuration}
              className={styles.duration}
              min={1}
              max={
                timeComparison.durationType === 'months'
                  ? MAX_MONTHS_TO_COMPARE
                  : MAX_DAYS_TO_COMPARE
              }
            />
            {durationTypeOption && (
              <Select
                options={DURATION_TYPES_OPTIONS}
                onSelect={trackAndChangeDurationType}
                onRemove={() => {}}
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

export default AnalysisBeforeAfter
