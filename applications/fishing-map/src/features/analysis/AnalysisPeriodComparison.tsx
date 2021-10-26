import { useTranslation } from 'react-i18next'
import { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { DateTime, DurationUnit } from 'luxon'
import { InputDate, InputText, Select } from '@globalfishingwatch/ui-components'
import { selectAnalysisTimeComparison } from 'features/app/app.selectors'
import { AnalysisTypeProps } from './Analysis'
import styles from './AnalysisPeriodComparison.module.css'
import useAnalysisDescription from './analysisDescription.hooks'
import AnalysisDescription from './AnalysisDescription'
import { DURATION_TYPES_OPTIONS, useAnalysisTimeCompareConnect } from './analysis.hooks'
import AnalysisPeriodComparisonGraph from './AnalysisPediodComparisonGraph'

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
  } = useAnalysisTimeCompareConnect('periodComparison')

  const { description } = useAnalysisDescription(analysisAreaName, layersTimeseriesFiltered?.[0])

  if (!timeComparison) return null

  return (
    <Fragment>
      <AnalysisDescription description={description} />
      {layersTimeseriesFiltered && (
        <AnalysisPeriodComparisonGraph
          graphData={layersTimeseriesFiltered}
          start={timeComparison.start}
          end={DateTime.fromISO(timeComparison.start)
            .plus({ [timeComparison.durationType as DurationUnit]: timeComparison.duration })
            .toString()}
        />
      )}
      <div className={styles.container}>
        <div className={styles.timeSelection}>
          <InputDate
            label={t('analysis.periodComparison1st', 'start of 1st period')}
            onChange={onStartChange}
            value={timeComparison.start}
          />
          <InputDate
            label={t('analysis.periodComparison2nd', 'start of 2nd period')}
            onChange={onCompareStartChange}
            value={timeComparison.compareStart}
          />
          <div className={styles.durationWrapper}>
            <InputText
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
