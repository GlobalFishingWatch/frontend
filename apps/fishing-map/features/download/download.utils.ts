import { t } from 'i18next'
import { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Dataset } from '@globalfishingwatch/api-types'
import { getUTCDateTime } from 'utils/dates'
import { REPORT_DAYS_LIMIT } from 'data/config'
import { GroupBy, TemporalResolution, TEMPORAL_RESOLUTION_OPTIONS } from './downloadActivity.config'

export function getDownloadReportSupported(start: string, end: string) {
  if (!start || !end) {
    return false
  }
  const startDateTime = getUTCDateTime(start)
  const endDateTime = getUTCDateTime(end)

  return endDateTime.diff(startDateTime, ['days']).days <= REPORT_DAYS_LIMIT
}

export function getSupportedGroupByOptions(
  options: ChoiceOption[],
  vesselDatasets: Dataset[]
): ChoiceOption[] {
  if (!options?.length) {
    return []
  }
  const mmsiSupported = vesselDatasets.every((dataset) => {
    return dataset?.schema?.mmsi !== undefined
  })

  return options.map((option) => {
    if (option.id === GroupBy.MMSI && !mmsiSupported) {
      return {
        ...option,
        disabled: true,
        tooltip: t(
          'download.mmsiNotSupported',
          "The datasets selected don't support grouping by MMSI"
        ),
        tooltipPlacement: 'top',
      }
    }
    return option
  }) as ChoiceOption[]
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
  }) as ChoiceOption[]
}
