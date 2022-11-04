import { t } from 'i18next'
import { ChoiceOption } from '@globalfishingwatch/ui-components'
import { getUTCDateTime } from 'utils/dates'
import { REPORT_DAYS_LIMIT } from 'data/config'
import { TemporalResolution, TEMPORAL_RESOLUTION_OPTIONS } from './downloadActivity.config'

export function getDownloadReportSupported(start: string, end: string) {
  if (!start || !end) {
    return false
  }
  const startDateTime = getUTCDateTime(start)
  const endDateTime = getUTCDateTime(end)

  return endDateTime.diff(startDateTime, ['days']).days <= REPORT_DAYS_LIMIT
}

export function getSupportedTemporalResolutions(start: string, end: string): ChoiceOption[] {
  if (!start || !end) {
    return []
  }
  const startDateTime = getUTCDateTime(start)
  const endDateTime = getUTCDateTime(end)
  const duration = {
    years: endDateTime.diff(startDateTime, ['years']).years,
    months: endDateTime.diff(startDateTime, ['months']).months,
    days: endDateTime.diff(startDateTime, ['days']).days,
  }

  return TEMPORAL_RESOLUTION_OPTIONS.map((option) => {
    if (option.id === TemporalResolution.Yearly && duration?.years < 1) {
      return {
        ...option,
        disabled: true,
        tooltip: t('download.yearlyNotAvailable', 'Your time range is shorter than 1 year'),
        tooltipPlacement: 'top',
      }
    }
    if (option.id === TemporalResolution.Monthly && duration?.years < 1 && duration?.months < 1) {
      return {
        ...option,
        disabled: true,
        tooltip: t('download.monthlyNotAvailable', 'Your time range is shorter than 1 month'),
        tooltipPlacement: 'top',
      }
    }
    return option
  })
}
