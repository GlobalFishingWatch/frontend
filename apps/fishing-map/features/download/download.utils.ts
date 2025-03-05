import { t } from 'i18next'

import type { Dataset, DatasetConfigurationInterval } from '@globalfishingwatch/api-types'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import { getDatasetConfigurationProperty } from '@globalfishingwatch/datasets-client'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import type { ChoiceOption } from '@globalfishingwatch/ui-components'

import { REPORT_DAYS_LIMIT } from 'data/config'
import { getActiveDatasetsInDataview, getDatasetSchemaItem } from 'features/datasets/datasets.utils'
import { getUTCDateTime } from 'utils/dates'

import {
  getTemporalResolutionOptions,
  GroupBy,
  TemporalResolution,
} from './downloadActivity.config'

export function getDownloadReportSupported(start: string, end: string) {
  if (!start || !end) {
    return false
  }
  const startDateTime = getUTCDateTime(start)
  const endDateTime = getUTCDateTime(end)

  return endDateTime.diff(startDateTime, ['days']).days <= REPORT_DAYS_LIMIT
}

export function getSupportedGroupByOptions(
  options: ChoiceOption<GroupBy>[],
  vesselDatasets: Dataset[]
): ChoiceOption<GroupBy>[] {
  if (!options?.length) {
    return []
  }

  const mmsiSupported = vesselDatasets.every((dataset) => {
    const schemaItem = getDatasetSchemaItem(dataset, 'ssvid')
    return schemaItem !== null && schemaItem !== undefined
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
  })
}

const FALLBACK_HEATMAP_INTERVALS: FourwingsInterval[] = ['HOUR', 'DAY', 'MONTH', 'YEAR']
const FALLBACK_ENVIRONMENT_INTERVALS: FourwingsInterval[] = ['DAY', 'MONTH']

function hasDataviewWithIntervalSupported(
  dataviews: UrlDataviewInstance[],
  interval: DatasetConfigurationInterval
) {
  return dataviews.every((dataview) => {
    const datasets = getActiveDatasetsInDataview(dataview)
    return datasets?.every((dataset) => {
      const datasetIntervalsConfig = getDatasetConfigurationProperty({
        dataset,
        property: 'intervals',
      })
      const intervals = datasetIntervalsConfig?.length
        ? datasetIntervalsConfig
        : dataview.category === DataviewCategory.Environment
        ? FALLBACK_HEATMAP_INTERVALS
        : FALLBACK_ENVIRONMENT_INTERVALS
      return intervals.includes(interval) || intervals.includes(interval.toLowerCase() as any)
    })
  })
}

export function getSupportedTemporalResolutions(
  dataviews: UrlDataviewInstance[],
  { start, end }: { start: string; end: string }
): ChoiceOption<TemporalResolution>[] {
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

  return getTemporalResolutionOptions().flatMap((option) => {
    if (option.id === TemporalResolution.Full) {
      return option
    }
    if (option.id === TemporalResolution.Yearly) {
      if (duration?.years > 1) {
        return {
          ...option,
          disabled: true,
          tooltip: t('download.yearlyNotAvailable', 'Your time range is shorter than 1 year'),
          tooltipPlacement: 'top',
        }
      }
      const dataviewsWithIntervalSupported = hasDataviewWithIntervalSupported(dataviews, 'YEAR')
      return dataviewsWithIntervalSupported ? option : []
    }
    if (option.id === TemporalResolution.Monthly) {
      if (duration?.years < 1 && duration?.months < 1) {
        return {
          ...option,
          disabled: true,
          tooltip: t('download.monthlyNotAvailable', 'Your time range is shorter than 1 month'),
          tooltipPlacement: 'top',
        }
      }
      const dataviewsWithIntervalSupported = hasDataviewWithIntervalSupported(dataviews, 'MONTH')
      return dataviewsWithIntervalSupported ? option : []
    }
    if (option.id === TemporalResolution.Daily) {
      const dataviewsWithIntervalSupported = hasDataviewWithIntervalSupported(dataviews, 'DAY')
      return dataviewsWithIntervalSupported ? option : []
    }
    return option
  })
}
