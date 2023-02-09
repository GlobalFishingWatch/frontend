/**
 *
 * @param filters Dataview filters
 * @returns Conditions transformed to apply in the API request and
 *          joined by AND operator
 */
import { format } from 'd3-format'
import { DateTime } from 'luxon'
import { Interval } from '@globalfishingwatch/layer-composer'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { sortStrings } from 'utils/shared'
import { t } from 'features/i18n/i18n'
import {
  getSchemaFieldsSelectedInDataview,
  SupportedDatasetSchema,
} from 'features/datasets/datasets.utils'

const arrayToStringTransform = (array: string[]) =>
  `(${array?.map((v: string) => `'${v}'`).join(', ')})`

export const transformFilters = (filters: Record<string, any>): string => {
  const queryFiltersFields = [
    {
      value: filters.flag,
      field: 'flag',
      operator: 'IN',
      transformation: arrayToStringTransform,
    },
    {
      value: filters.fleet,
      field: 'fleet',
      operator: 'IN',
      transformation: arrayToStringTransform,
    },
    {
      value: filters.origin,
      field: 'origin',
      operator: 'IN',
      transformation: arrayToStringTransform,
    },
    {
      value: filters.geartype,
      field: 'geartype',
      operator: 'IN',
      transformation: arrayToStringTransform,
    },
    {
      value: filters.vessel_type,
      field: 'vessel_type',
      operator: 'IN',
      transformation: arrayToStringTransform,
    },
  ]

  return queryFiltersFields
    .filter(({ value }) => value && value !== undefined)
    .map(
      ({ field, operator, transformation, value }) =>
        `${field} ${operator} ${transformation ? transformation(value) : `'${value}'`}`
    )
    .join(' AND ')
}

export const tickFormatter = (tick: number) => {
  const formatter = tick < 1 && tick > -1 ? '~r' : '~s'
  return format(formatter)(tick)
}

export const formatDate = (date: DateTime, timeChunkInterval: Interval | string) => {
  let formattedLabel = ''
  switch (timeChunkInterval) {
    case 'month':
    case 'months':
      formattedLabel += date.toFormat('LLLL y')
      break
    case 'day':
    case 'days':
      formattedLabel += date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)
      break
    default:
      formattedLabel += date.toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)
      break
  }
  return formattedLabel
}

export const formatTooltipValue = (value: number, unit: string, asDifference = false) => {
  if (value === undefined) {
    return null
  }
  const valueFormatted = formatI18nNumber(value, { maximumFractionDigits: 2 })
  const valueLabel = `${value > 0 && asDifference ? '+' : ''}${valueFormatted} ${unit ? unit : ''}`
  return valueLabel
}

const getSerializedDatasets = (dataview: UrlDataviewInstance) => {
  return dataview.config?.datasets?.slice().sort(sortStrings).join(', ')
}

const getSerializedFilterFields = (dataview: UrlDataviewInstance, filterKey: string): string => {
  return dataview.config?.filters?.[filterKey]?.slice().sort(sortStrings).join(', ')
}

export const FIELDS = [
  ['geartype', 'layer.gearType_other', 'Gear types'],
  ['fleet', 'layer.fleet_other', 'Fleets'],
  ['origin', 'vessel.origin', 'Origin'],
  ['vessel_type', 'vessel.vesselType_other', 'Vessel types'],
]

export const getCommonProperties = (dataviews: UrlDataviewInstance[]) => {
  const commonProperties: string[] = []

  if (dataviews && dataviews?.length > 0) {
    if (
      dataviews?.every((dataview) => dataview.category === dataviews[0].category) &&
      dataviews?.every((dataview) => dataview.name === dataviews[0].name)
    ) {
      commonProperties.push('dataset')
    }

    const firstDataviewDatasets = getSerializedDatasets(dataviews[0])
    if (
      dataviews?.every((dataview) => {
        const datasets = getSerializedDatasets(dataview)
        return datasets === firstDataviewDatasets
      })
    ) {
      commonProperties.push('source')
    }

    const firstDataviewFlags = getSerializedFilterFields(dataviews[0], 'flag')
    if (
      dataviews?.every((dataview) => {
        const flags = getSerializedFilterFields(dataview, 'flag')
        return flags === firstDataviewFlags
      })
    ) {
      commonProperties.push('flag')
    }

    // Collect common filters that are not 'flag'
    const firstDataviewGenericFilterKeys =
      dataviews[0].config && dataviews[0].config?.filters
        ? Object.keys(dataviews[0].config?.filters).filter((key) => key !== 'flag')
        : []

    const genericFilters: Record<string, string>[] = []
    const genericExcludedFilters: Record<string, string>[] = []
    firstDataviewGenericFilterKeys.forEach((filterKey) => {
      const firstDataviewGenericFilterFields = getSerializedFilterFields(dataviews[0], filterKey)
      if (
        dataviews?.every((dataview) => {
          const genericFilterFields = getSerializedFilterFields(dataview, filterKey)
          return genericFilterFields === firstDataviewGenericFilterFields
        })
      ) {
        const keyLabelField = FIELDS.find((field) => field[0] === filterKey)
        const keyLabel = keyLabelField
          ? t(keyLabelField[1], keyLabelField[2]).toLocaleLowerCase()
          : filterKey

        const valuesLabel = getSchemaFieldsSelectedInDataview(
          dataviews[0],
          filterKey as SupportedDatasetSchema
        )
          .map((f) => f.label.toLocaleLowerCase())
          .join(', ')

        if (dataviews[0].config?.filterOperators?.[filterKey] === 'exclude') {
          genericExcludedFilters.push({
            keyLabel,
            valuesLabel,
          })
        } else {
          genericFilters.push({
            keyLabel,
            valuesLabel,
          })
        }
        commonProperties.push(filterKey)
      }
    })
  }

  return commonProperties
}
