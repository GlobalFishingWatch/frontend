import { t } from 'i18next'

import type { Dataset, DatasetConfigurationInterval } from '@globalfishingwatch/api-types'
import { DatasetSubCategory, DataviewCategory } from '@globalfishingwatch/api-types'
import {
  getDatasetConfigurationProperty,
  getDatasetFilterItem,
} from '@globalfishingwatch/datasets-client'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import type { ChoiceOption } from '@globalfishingwatch/ui-components'

import { REPORT_DAYS_LIMIT } from 'data/config'
import { PRESENCE_DATAVIEW_INSTANCE_ID } from 'data/dataviews'
import { getActiveDatasetsInDataview } from 'features/datasets/datasets.utils'
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
  vesselDatasets: Dataset[],
  dataviews: UrlDataviewInstance[]
): ChoiceOption<GroupBy>[] {
  if (!options?.length) {
    return []
  }
  const hasPresenceDataview = dataviews.some(
    (dataview) =>
      dataview.id.includes(DatasetSubCategory.Presence) ||
      dataview.id.includes(PRESENCE_DATAVIEW_INSTANCE_ID)
  )

  const mmsiSupported = vesselDatasets.every((dataset) => {
    const schemaItem = getDatasetFilterItem(dataset, 'ssvid')
    return schemaItem !== null && schemaItem !== undefined
  })

  return options.map((option) => {
    if (option.id === GroupBy.MMSI && !mmsiSupported) {
      return {
        ...option,
        disabled: true,
        tooltip: t((t) => t.download.groupByNotSupported, {
          property: option.label,
        }),
        tooltipPlacement: 'top',
      }
    }
    if (
      hasPresenceDataview &&
      (option.id === GroupBy.GearType || option.id === GroupBy.FlagAndGearType)
    ) {
      return {
        ...option,
        disabled: true,
        tooltip: t((t) => t.download.groupByNotSupported, {
          property: option.label,
        }),
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
        type: 'fourwingsV1',
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
          tooltip: t((t) => t.download.yearlyNotAvailable),
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
          tooltip: t((t) => t.download.monthlyNotAvailable),
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
