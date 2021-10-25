import { useTranslation } from 'react-i18next'
import { Fragment, useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import { InputDate, InputText, Select } from '@globalfishingwatch/ui-components'
import { SelectOption } from '@globalfishingwatch/ui-components/dist/select'
import { selectAnalysisTimeComparison } from 'features/app/app.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { DEFAULT_WORKSPACE } from 'data/config'
import { AnalysisTypeProps } from './Analysis'
import styles from './AnalysisPeriodComparison.module.css'
import useAnalysisDescription from './analysisDescription.hooks'
import AnalysisDescription from './AnalysisDescription'

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

const parseFullISODate = (d: string) => DateTime.fromISO(d).toUTC()

const parseYYYYMMDDDate = (d: string) => DateTime.fromISO(d).setZone('utc', { keepLocalTime: true })

const AnalysisPeriodComparison: React.FC<AnalysisTypeProps> = (props) => {
  const { layersTimeseriesFiltered, analysisAreaName } = props
  const { t } = useTranslation()
  const timeComparison = useSelector(selectAnalysisTimeComparison)
  const { dispatchQueryParams } = useLocationConnect()
  const { start: timebarStart } = useTimerangeConnect()

  useEffect(() => {
    const baseStart = timebarStart || DEFAULT_WORKSPACE.availableEnd
    const initialStart = parseFullISODate(baseStart).minus({ years: 1 }).toISO()
    const initialCompareStart = baseStart
    dispatchQueryParams({
      analysisTimeComparison: {
        start: initialStart,
        compareStart: initialCompareStart,
        duration: 6,
        durationType: 'months',
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const update = useCallback(
    ({ newStart, newCompareStart, newDuration, newDurationType }) => {
      const start = newStart
        ? parseYYYYMMDDDate(newStart).toISO()
        : parseFullISODate(timeComparison.start).toISO()
      const compareStart = newCompareStart
        ? parseYYYYMMDDDate(newCompareStart).toISO()
        : parseFullISODate(timeComparison.compareStart as string).toISO()

      const duration = newDuration || timeComparison.duration
      const durationType = newDurationType || timeComparison.durationType

      dispatchQueryParams({
        analysisTimeComparison: {
          start,
          compareStart,
          duration,
          durationType,
        },
      })
    },
    [timeComparison, dispatchQueryParams]
  )

  const onStartChange = useCallback(
    (e) => {
      update({ newStart: e.target.value })
    },
    [update]
  )

  const onCompareStartChange = useCallback(
    (e) => {
      update({ newCompareStart: e.target.value })
    },
    [update]
  )

  const onDurationChange = useCallback(
    (e) => {
      update({ newDuration: e.target.value })
    },
    [update]
  )

  const onDurationTypeSelect = useCallback(
    (option) => {
      update({ newDurationType: option.id })
    },
    [update]
  )

  const durationTypeOption = useMemo(() => {
    if (!timeComparison) return null
    return DURATION_TYPES_OPTIONS.find((o) => o.id === timeComparison.durationType)
  }, [timeComparison])

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
