import { useTranslation } from 'react-i18next'
import { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { InputDate, InputText, Select } from '@globalfishingwatch/ui-components'
import { selectAnalysisTimeComparison } from 'features/app/app.selectors'
import { AnalysisTypeProps } from './Analysis'
import styles from './AnalysisPeriodComparison.module.css'
import useAnalysisDescription from './analysisDescription.hooks'
import AnalysisDescription from './AnalysisDescription'
import { DURATION_TYPES_OPTIONS, useAnalysisTimeCompareConnect } from './analysis.hooks'

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

  if (!timeComparison) return null

  return (
    <Fragment>
      <AnalysisDescription description={description} />
      {/* 
        TODO: Draw graph using layersTimeseriesFiltered
        Each timeseries item has:
        - min and max arrays, each of them having exactly two values (value for 1st period, value for 2nd period)
        - date: date for the first period
        - compareDate: ddate for the second period
        It might be easier to deal with those values for those graphs by splitting the timeseries in two, which could be done in analysis.hooks
      */}
      <div className={styles.container}>
        <div className={styles.timeSelection}>
          <InputDate
            label={t('analysis.periodComparison1st', 'start of 1st period')}
            onChange={onStartChange}
            value={timeComparison.start}
            min={MIN_DATE}
            max={MAX_DATE}
          />
          <InputDate
            label={t('analysis.periodComparison2nd', 'start of 2nd period')}
            onChange={onCompareStartChange}
            value={timeComparison.compareStart}
            min={timeComparison.start.slice(0, 10)}
            max={MAX_DATE}
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
