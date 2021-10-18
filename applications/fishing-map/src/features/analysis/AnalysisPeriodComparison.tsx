import { useTranslation } from 'react-i18next'
import { useCallback } from 'react'
import { InputDate, InputText, Select } from '@globalfishingwatch/ui-components'
import { SelectOption } from '@globalfishingwatch/ui-components/dist/select'
import { AnalysisTypeProps } from './Analysis'
import styles from './AnalysisPeriodComparison.module.css'

const DURATION_TYPES_OPTIONS: SelectOption[] = [
  {
    id: 'days',
    label: 'days',
  },
  {
    id: 'months',
    label: 'months',
  },
]

const AnalysisPeriodComparison: React.FC<AnalysisTypeProps> = (props) => {
  // const { layersTimeseriesFiltered, hasAnalysisLayers, analysisAreaName } = props
  const { t } = useTranslation()

  const onDurationChange = useCallback((value) => {
    console.log(value)
  }, [])

  const onDurationTypeSelect = useCallback((option) => {
    console.log(option)
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.timeSelection}>
        <InputDate label={t('analysis.periodComparison1st', 'start of 1st period')} />
        <InputDate label={t('analysis.periodComparison2nd', 'start of 2nd period')} />
        <div className={styles.durationWrapper}>
          <InputText
            label={t('analysis.periodComparisonDuration', 'duration')}
            value={6}
            type="number"
            onChange={onDurationChange}
            className={styles.duration}
          />
          <Select
            options={DURATION_TYPES_OPTIONS}
            onSelect={onDurationTypeSelect}
            onRemove={() => {}}
            className={styles.durationType}
            selectedOption={DURATION_TYPES_OPTIONS[1]}
          />
        </div>
      </div>
    </div>
  )
}

export default AnalysisPeriodComparison
