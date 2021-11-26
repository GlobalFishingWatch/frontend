import { useTranslation } from 'react-i18next'
import { Fragment, useMemo } from 'react'
import { useSelector } from 'react-redux'
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
    MIN_DATE,
    MAX_DATE,
  } = useAnalysisTimeCompareConnect('periodComparison')

  const { description } = useAnalysisDescription(analysisAreaName, layersTimeseriesFiltered?.[0])
  const dataviewsIds = useMemo(() => {
    if (!layersTimeseriesFiltered) return []
    return layersTimeseriesFiltered[0].sublayers.map((s) => s.id)
  }, [layersTimeseriesFiltered])
  const dataviews = useSelector(selectDataviewInstancesByIds(dataviewsIds))

  //TODO timeComparison.start is null when coming from before7after

  if (!timeComparison) return null

  const isLoading =
    !layersTimeseriesFiltered ||
    !layersTimeseriesFiltered[0] ||
    !layersTimeseriesFiltered[0].timeseries.length

  return (
    <Fragment>
      <AnalysisDescription description={description} />
      <div className={styles.container}>
        {dataviews &&
          dataviews.map((d) => <DatasetFilterSource key={d.id} dataview={d} hideColor={true} />)}
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
          <InputDate
            htmlLabel={
              <Fragment>
                <svg width="24" height="10">
                  <path
                    d="M 0, 5 H 18"
                    stroke="rgb(111, 138, 182)"
                    strokeDasharray="4 2"
                    strokeWidth={2}
                  ></path>
                </svg>
                {t('analysis.periodComparison1st', 'Baseline start')}
              </Fragment>
            }
            label={t('analysis.periodComparison1st', 'Baseline start')}
            onChange={onStartChange}
            value={timeComparison.start}
            min={MIN_DATE}
            max={timeComparison.compareStart.slice(0, 10)}
          />
          <InputDate
            htmlLabel={
              <Fragment>
                <svg width="24" height="10">
                  <path
                    d="M 0, 5 h 4 v 4 h 4 v -8 h 4 v 4 h 4"
                    stroke="rgb(22, 63, 137) "
                    strokeWidth={2}
                    fill="none"
                  ></path>
                </svg>
                {t('analysis.periodComparison2nd', 'comparison start')}
              </Fragment>
            }
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
