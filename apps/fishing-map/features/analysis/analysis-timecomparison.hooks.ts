import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { SelectOption } from '@globalfishingwatch/ui-components'
import { t } from 'features/i18n/i18n'
import { WorkspaceAnalysisType } from 'types'
import { DEFAULT_WORKSPACE } from 'data/config'
import { selectAnalysisTimeComparison } from 'features/app/app.selectors'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { useLocationConnect } from 'routes/routes.hook'
import { getUTCDateTime } from 'utils/dates'
import { useFitAreaInViewport } from 'features/analysis/analysis.hooks'

export const DURATION_TYPES_OPTIONS: SelectOption[] = [
  {
    id: 'days',
    label: t('common.days_other'),
  },
  {
    id: 'months',
    label: t('common.months_other'),
  },
]

const MIN_DATE = DEFAULT_WORKSPACE.availableStart.slice(0, 10)
const MAX_DATE = DEFAULT_WORKSPACE.availableEnd.slice(0, 10)
export const MAX_DAYS_TO_COMPARE = 100
export const MAX_MONTHS_TO_COMPARE = 12

export const useAnalysisTimeCompareConnect = (analysisType: WorkspaceAnalysisType) => {
  const { dispatchQueryParams } = useLocationConnect()
  const fitAreaInViewport = useFitAreaInViewport()
  const { start: timebarStart, end: timebarEnd } = useTimerangeConnect()
  const [errorMsg, setErrorMsg] = useState(null)
  const timeComparison = useSelector(selectAnalysisTimeComparison)
  const durationType = timeComparison?.durationType
  const duration = timeComparison?.duration

  useEffect(() => {
    if (timeComparison) {
      if (analysisType === 'beforeAfter') {
        // make sure start is properly recalculated again in beforeAfter mode when coming from another mode
        const newStart = getUTCDateTime(timeComparison.compareStart)
          .minus({ [timeComparison.durationType]: timeComparison.duration })
          .toISO()
        dispatchQueryParams({
          analysisTimeComparison: {
            ...timeComparison,
            start: newStart,
          },
        })
      }
      return
    }
    const baseStart = timebarStart || DEFAULT_WORKSPACE.availableStart
    const baseEnd = timebarEnd || DEFAULT_WORKSPACE.availableEnd
    const initialDuration = getUTCDateTime(baseEnd).diff(getUTCDateTime(baseStart), [
      'days',
      'months',
    ])
    const initialDurationType = initialDuration.as('days') >= 30 ? 'months' : 'days'
    const initialDurationValue =
      initialDurationType === 'days'
        ? Math.max(1, Math.round(initialDuration.days))
        : Math.min(MAX_MONTHS_TO_COMPARE, Math.round(initialDuration.months))

    const baseStartMinusOffset =
      analysisType === 'periodComparison'
        ? { years: 1 }
        : { [initialDurationType]: initialDurationValue }
    const initialStart = getUTCDateTime(baseStart).minus(baseStartMinusOffset).toISO()
    const initialCompareStart = baseStart

    dispatchQueryParams({
      analysisTimeComparison: {
        start: initialStart,
        compareStart: initialCompareStart,
        duration: initialDurationValue,
        durationType: initialDurationType,
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const update = useCallback(
    ({ newStart, newCompareStart, newDuration, newDurationType, error }: any) => {
      const compareStart = getUTCDateTime(
        newCompareStart ? newCompareStart : (timeComparison.compareStart as string)
      ).toISO()

      const duration = newDuration || timeComparison.duration
      const durationType = newDurationType || timeComparison.durationType

      const startFromCompareStart = getUTCDateTime(compareStart).minus({
        [durationType]: duration,
      })

      let start: string
      if (analysisType === 'beforeAfter') {
        // In before/after mode, start of 1st period is calculated automatically depending on start of 2nd period (compareStart)
        start = startFromCompareStart.toISO()
      } else {
        start = getUTCDateTime(newStart ? newStart : timeComparison.start).toISO()

        // If new duration is set, make sure there delta from start to compareStart is >= of new duration
        if (
          newDuration &&
          startFromCompareStart.toMillis() - getUTCDateTime(timeComparison.start).toMillis() <= 0
        ) {
          start = startFromCompareStart.toISO()
        }
      }

      fitAreaInViewport()
      dispatchQueryParams({
        analysisTimeComparison: {
          start,
          compareStart,
          duration,
          durationType,
        },
      })
      if (error) {
        setErrorMsg(
          t(
            'analysis.errorPeriodComparisonDateRange',
            'Date range error. Comparison start must be after baseline start.'
          )
        )
      } else {
        setErrorMsg(null)
      }
    },
    [timeComparison, analysisType, fitAreaInViewport, dispatchQueryParams]
  )

  const onStartChange = useCallback(
    (e) => {
      update({
        newStart: e.target.value,
        error: e.target.validity.rangeOverflow || e.target.validity.rangeUnderflow,
      })
    },
    [update]
  )

  const onCompareStartChange = useCallback(
    (e) => {
      update({
        newCompareStart: e.target.value,
        error: e.target.validity.rangeOverflow || e.target.validity.rangeUnderflow,
      })
    },
    [update]
  )

  const onDurationChange = useCallback(
    (e) => {
      if (
        (durationType === 'months' && e.target.value > MAX_MONTHS_TO_COMPARE) ||
        (durationType === 'days' && e.target.value > MAX_DAYS_TO_COMPARE)
      )
        return
      update({ newDuration: e.target.value })
    },
    [durationType, update]
  )

  const onDurationTypeSelect = useCallback(
    (option) => {
      if (option.id === 'months' && duration > MAX_MONTHS_TO_COMPARE) {
        update({ newDurationType: option.id, newDuration: MAX_MONTHS_TO_COMPARE })
      } else {
        update({ newDurationType: option.id })
      }
    },
    [duration, update]
  )

  const durationTypeOption = useMemo(() => {
    if (!timeComparison) return null
    return DURATION_TYPES_OPTIONS.find((o) => o.id === timeComparison.durationType)
  }, [timeComparison])

  return {
    onStartChange,
    onCompareStartChange,
    onDurationChange,
    onDurationTypeSelect,
    durationTypeOption,
    errorMsg,
    MIN_DATE,
    MAX_DATE,
  }
}
