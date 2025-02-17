import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { DateTime } from 'luxon'

import type { SelectOption } from '@globalfishingwatch/ui-components'

import { AVAILABLE_END, AVAILABLE_START } from 'data/config'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { useFitAreaInViewport } from 'features/reports/report-area/area-reports.hooks'
import {
  selectReportActivityGraph,
  selectReportTimeComparison,
} from 'features/reports/reports.config.selectors'
import type { ReportActivityGraph } from 'features/reports/reports.types'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { useLocationConnect } from 'routes/routes.hook'
import { getUTCDateTime } from 'utils/dates'

import { MAX_DAYS_TO_COMPARE, MAX_MONTHS_TO_COMPARE } from './reports-activity.config'

// TODO get this from start and endDate from datasets
const MIN_DATE = AVAILABLE_START.slice(0, 10)
const MAX_DATE = AVAILABLE_END.slice(0, 10)

export const useSetReportTimeComparison = () => {
  const timeComparison = useSelector(selectReportTimeComparison)
  const durationType = timeComparison?.durationType
  const duration = timeComparison?.duration
  const { dispatchQueryParams } = useLocationConnect()
  const { start: timebarStart, end: timebarEnd } = useTimerangeConnect()

  const setReportTimecomparison = useCallback(
    (activityType: ReportActivityGraph) => {
      if (timeComparison) {
        if (activityType === 'beforeAfter') {
          // make sure start is properly recalculated again in beforeAfter mode when coming from another mode
          const newStart = getUTCDateTime(timeComparison?.compareStart)
            .minus({ [durationType!]: duration })
            .toISO() as string
          dispatchQueryParams({
            start: timebarStart,
            end: timebarEnd,
            reportTimeComparison: {
              ...timeComparison,
              start: newStart,
            },
          })
        }
        return
      }
      const baseStart = timebarStart || AVAILABLE_START
      const baseEnd = timebarEnd || AVAILABLE_END
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
      const initialStart = getUTCDateTime(baseStart).minus(baseStartMinusOffset).toISO() as string
      const initialCompareStart = baseStart

      dispatchQueryParams({
        reportTimeComparison: {
          start: initialStart,
          compareStart: initialCompareStart,
          duration: initialDurationValue,
          durationType: initialDurationType,
        },
      })
    },
    [dispatchQueryParams, duration, durationType, timeComparison, timebarEnd, timebarStart]
  )

  const resetReportTimecomparison = useCallback(() => {
    dispatchQueryParams({ start: timebarStart, end: timebarEnd, reportTimeComparison: undefined })
  }, [dispatchQueryParams, timebarEnd, timebarStart])

  return useMemo(
    () => ({ setReportTimecomparison, resetReportTimecomparison }),
    [resetReportTimecomparison, setReportTimecomparison]
  )
}

export const useReportTimeCompareConnect = (activityType: ReportActivityGraph) => {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const fitAreaInViewport = useFitAreaInViewport()
  const [errorMsg, setErrorMsg] = useState('')
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

  const update = useCallback(
    ({ newStart, newCompareStart, newDuration, newDurationType, error }: any) => {
      const compareStart = getUTCDateTime(
        newCompareStart ? newCompareStart : (timeComparison?.compareStart as string)
      ).toISO() as string

      const duration = newDuration || timeComparison?.duration
      const durationType = newDurationType || timeComparison?.durationType

      const startFromCompareStart = getUTCDateTime(compareStart).minus({
        [durationType]: duration,
      })

      let start: string
      if (activityType === 'beforeAfter') {
        // In before/after mode, start of 1st period is calculated automatically depending on start of 2nd period (compareStart)
        start = startFromCompareStart.toISO() as string
      } else {
        start = getUTCDateTime(newStart ? newStart : timeComparison?.start).toISO() as string

        // If new duration is set, make sure there delta from start to compareStart is >= of new duration
        if (
          newDuration &&
          timeComparison?.start &&
          startFromCompareStart.toMillis() - getUTCDateTime(timeComparison?.start).toMillis() <= 0
        ) {
          start = startFromCompareStart.toISO() as string
        }
      }

      fitAreaInViewport()
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
        setErrorMsg('')
      }
    },
    [
      timeComparison?.compareStart,
      timeComparison?.duration,
      timeComparison?.durationType,
      timeComparison?.start,
      activityType,
      fitAreaInViewport,
      dispatchQueryParams,
      t,
    ]
  )

  const onStartChange = useCallback(
    (e: any) => {
      update({
        newStart: e.target.value,
        error: e.target.validity.rangeOverflow || e.target.validity.rangeUnderflow,
      })
    },
    [update]
  )

  const onCompareStartChange = useCallback(
    (e: any) => {
      update({
        newCompareStart: e.target.value,
        error: e.target.validity.rangeOverflow || e.target.validity.rangeUnderflow,
      })
    },
    [update]
  )

  const onDurationChange = useCallback(
    (e: any) => {
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
    (option: SelectOption) => {
      if (option.id === 'months' && duration && duration > MAX_MONTHS_TO_COMPARE) {
        update({ newDurationType: option.id, newDuration: MAX_MONTHS_TO_COMPARE })
      } else {
        update({ newDurationType: option.id })
      }
    },
    [duration, update]
  )

  const durationTypeOption = useMemo(() => {
    if (!timeComparison) return null
    return durationTypeOptions.find((o) => o.id === timeComparison?.durationType)
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

export const useTimeCompareTimeDescription = (addPrefix = true) => {
  const { t } = useTranslation()
  const timeComparison = useSelector(selectReportTimeComparison)
  const reportGraph = useSelector(selectReportActivityGraph)
  if (!timeComparison) return undefined
  const startLabel = formatI18nDate(timeComparison?.start, {
    format: DateTime.DATE_MED_WITH_WEEKDAY,
  })
  const compareStartLabel = formatI18nDate(timeComparison?.compareStart, {
    format: DateTime.DATE_MED_WITH_WEEKDAY,
  })

  const durationTypeLabel: string =
    parseInt(timeComparison?.duration as any) === 1
      ? t(`common.${timeComparison?.durationType}_one`)
      : t(`common.${timeComparison?.durationType}_other`)
  const durationLabel = [timeComparison?.duration, durationTypeLabel].join(' ')

  let label: string =
    reportGraph === 'periodComparison'
      ? t('analysis.periodComparisonRange', {
          compareStart: formatI18nDate(timeComparison?.compareStart, {
            format: DateTime.DATE_MED_WITH_WEEKDAY,
          }),
          start: startLabel,
          duration: durationLabel,
          defaultValue:
            'in the {{duration}} following {{compareStart}} compared to baseline in the {{duration}} following {{start}}',
        })
      : t('analysis.beforeAfterRange', {
          compareStart: compareStartLabel,
          duration: durationLabel,
          defaultValue: 'between the {{duration}} before and after {{compareStart}}',
        })

  if (addPrefix) {
    label = [t('analysis.change', 'Change'), label].join(' ')
  }

  return label
}
