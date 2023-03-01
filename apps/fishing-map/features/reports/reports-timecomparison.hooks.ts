import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { SelectOption } from '@globalfishingwatch/ui-components'
import { ReportActivityGraph } from 'types'
import { DEFAULT_WORKSPACE } from 'data/config'
import { selectReportTimeComparison } from 'features/app/app.selectors'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { useLocationConnect } from 'routes/routes.hook'
import { getUTCDateTime } from 'utils/dates'

// TODO get this from start and endDate from datasets
const MIN_DATE = DEFAULT_WORKSPACE.availableStart.slice(0, 10)
const MAX_DATE = DEFAULT_WORKSPACE.availableEnd.slice(0, 10)
export const MAX_DAYS_TO_COMPARE = 100
export const MAX_MONTHS_TO_COMPARE = 12

export const useReportTimeCompareConnect = (activityType: ReportActivityGraph) => {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const { start: timebarStart, end: timebarEnd } = useTimerangeConnect()
  const [errorMsg, setErrorMsg] = useState(null)
  const timeComparison = useSelector(selectReportTimeComparison)
  const durationType = timeComparison?.durationType
  const duration = timeComparison?.duration

  const durationTypeOptions: SelectOption[] = useMemo(
    () => [
      {
        id: 'days',
        label: t('common.days_other'),
      },
      {
        id: 'months',
        label: t('common.months_other'),
      },
    ],
    [t]
  )

  useEffect(() => {
    if (timeComparison) {
      if (activityType === 'beforeAfter') {
        // make sure start is properly recalculated again in beforeAfter mode when coming from another mode
        const newStart = getUTCDateTime(timeComparison.compareStart)
          .minus({ [durationType]: duration })
          .toISO()
        dispatchQueryParams({
          reportTimeComparison: {
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
      activityType === 'periodComparison'
        ? { years: 1 }
        : { [initialDurationType]: initialDurationValue }
    const initialStart = getUTCDateTime(baseStart).minus(baseStartMinusOffset).toISO()
    const initialCompareStart = baseStart

    dispatchQueryParams({
      reportTimeComparison: {
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
      if (activityType === 'beforeAfter') {
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

      // fitMapBounds(bounds, { padding: FIT_BOUNDS_ANALYSIS_PADDING })
      dispatchQueryParams({
        reportTimeComparison: {
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
    [timeComparison, activityType, dispatchQueryParams]
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
    return durationTypeOptions.find((o) => o.id === timeComparison.durationType)
  }, [durationTypeOptions, timeComparison])

  return useMemo(
    () => ({
      onStartChange,
      onCompareStartChange,
      onDurationChange,
      onDurationTypeSelect,
      durationTypeOption,
      durationTypeOptions,
      errorMsg,
      MIN_DATE,
      MAX_DATE,
    }),
    [
      durationTypeOption,
      durationTypeOptions,
      errorMsg,
      onCompareStartChange,
      onDurationChange,
      onDurationTypeSelect,
      onStartChange,
    ]
  )
}
