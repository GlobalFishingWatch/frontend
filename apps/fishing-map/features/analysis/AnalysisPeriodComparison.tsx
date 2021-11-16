import { useTranslation } from 'react-i18next'
import { Fragment, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { DateTime, DurationUnit } from 'luxon'
import { InputDate, InputText, Select, Spinner } from '@globalfishingwatch/ui-components'
import { selectAnalysisTimeComparison } from 'features/app/app.selectors'
import DatasetFilterSource from 'features/workspace/shared/DatasetSourceField'
import { selectDataviewInstancesByIds } from 'features/dataviews/dataviews.selectors'
import { AnalysisTypeProps } from './Analysis'
import useAnalysisDescription from './analysisDescription.hooks'
import AnalysisDescription from './AnalysisDescription'
import {
  DURATION_TYPES_OPTIONS,
  MAX_DAYS_TO_COMPARE,
  MAX_MONTHS_TO_COMPARE,
  useAnalysisTimeCompareConnect,
} from './analysis.hooks'
import AnalysisPeriodComparisonGraph from './AnalysisPeriodComparisonGraph'
import styles from './AnalysisPeriodComparison.module.css'

const AnalysisPeriodComparison: React.FC<AnalysisTypeProps> = (props) => {
  const { layersTimeseriesFiltered, analysisAreaName } = props
  const { t } = useTranslation()
  const timeComparison = useSelector(selectAnalysisTimeComparison)
  const {
    onStartChange,
    onCompareStartChange,
    onDurationChange,
    onDurationTypeSelect,
    durationTypeOption,
    MIN_DATE,
    MAX_DATE,
  } = useAnalysisTimeCompareConnect('periodComparison')

  const { description } = useAnalysisDescription(analysisAreaName, layersTimeseriesFiltered?.[0])
  const dataviewsIds = useMemo(() => {
    if (!layersTimeseriesFiltered) return []
    return layersTimeseriesFiltered[0].sublayers.map((s) => s.id)
  }, [layersTimeseriesFiltered])
  const dataviews = useSelector(selectDataviewInstancesByIds(dataviewsIds))
  if (!timeComparison) return null

  return (
    <Fragment>
      <AnalysisDescription description={description} />
      <div className={styles.container}>
        {dataviews && dataviews.map((d) => <DatasetFilterSource dataview={d} hideColor={true} />)}
      </div>
      {layersTimeseriesFiltered ? (
        <AnalysisPeriodComparisonGraph
          graphData={layersTimeseriesFiltered?.[0]}
          start={timeComparison.start}
          end={DateTime.fromISO(timeComparison.start)
            .plus({ [timeComparison.durationType as DurationUnit]: timeComparison.duration })
            .toString()}
        />
      ) : (
        <div className={styles.graphContainer}>
          <Spinner />
        </div>
      )}
      <div className={styles.container}>
        <div className={styles.timeSelection}>
          <InputDate
            label={t('analysis.periodComparison1st', 'Baseline start')}
            onChange={onStartChange}
            value={timeComparison.start}
            min={MIN_DATE}
            max={MAX_DATE}
          />
          <InputDate
            label={t('analysis.periodComparison2nd', 'comparison start')}
            onChange={onCompareStartChange}
            value={timeComparison.compareStart}
            min={timeComparison.start.slice(0, 10)}
            max={MAX_DATE}
          />
          <div className={styles.durationWrapper}>
            <InputText
              min={1}
              max={
                timeComparison.durationType === 'months'
                  ? MAX_MONTHS_TO_COMPARE
                  : MAX_DAYS_TO_COMPARE
              }
              label={t('analysis.periodComparisonDuration', 'duration')}
              value={timeComparison.duration}
              type="number"
              onChange={onDurationChange}
              className={styles.duration}
            />
            {durationTypeOption && (
              <Select
                options={DURATION_TYPES_OPTIONS}
                onSelect={onDurationTypeSelect}
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

export default AnalysisPeriodComparison
