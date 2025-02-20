import { EXCLUDE_FILTER_ID } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import type { SupportedDatasetSchema } from 'features/datasets/datasets.utils'
import {
  getSchemaFieldsSelectedInDataview,
  getSchemaFilterOperationInDataview,
} from 'features/datasets/datasets.utils'
import { t } from 'features/i18n/i18n'
import { sortStrings } from 'utils/shared'

const ALWAYS_SHOWN_FILTERS = ['vessel-groups']

export const FIELDS: [SupportedDatasetSchema, string, string][] = [
  ['geartype', 'layer.gearType_other', 'Gear types'],
  ['vessel-groups', 'vesselGroup.vesselGroup', 'Vessel Group'],
  ['origin', 'vessel.origin', 'Origin'],
  ['target_species', 'vessel.targetSpecies', 'Target species'],
  ['codMarinha', 'vessel.codMarinha', 'Cod Marinha'],
  ['fleet', 'vessel.fleet', 'Fleet'],
  ['license_category', 'vessel.license_category', 'License category'],
  ['casco', 'vessel.casco', 'Casco'],
  ['matched', 'vessel.matched', 'Match'],
  ['radiance', 'layer.radiance', 'Radiance'],
  ['neural_vessel_type', 'vessel.neural_vessel_type', 'SAR vessel type'],
  ['vessel_type', 'vessel.vesselType_other', 'Vessel types'],
  ['speed', 'layer.speed', 'Speed'],
]

const getSerializedDatasets = (dataview: UrlDataviewInstance) => {
  return dataview.config?.datasets?.slice().sort(sortStrings).join(', ')
}

const getSerializedFilterFields = (dataview: UrlDataviewInstance, filterKey: string): string => {
  const values = dataview.config?.filters?.[filterKey]
  return Array.isArray(values) ? values?.slice().sort(sortStrings).join(', ') : values
}

export const getCommonProperties = (dataviews: UrlDataviewInstance[]) => {
  const commonProperties: string[] = []

  if (dataviews && dataviews?.length > 1) {
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
    const firstDataviewFlagOperator = getSchemaFilterOperationInDataview(dataviews[0], 'flag')
    if (
      dataviews?.every((dataview) => {
        const flags = getSerializedFilterFields(dataview, 'flag')
        const flagOperator = getSchemaFilterOperationInDataview(dataview, 'flag')
        return flags === firstDataviewFlags && flagOperator === firstDataviewFlagOperator
      })
    ) {
      commonProperties.push('flag')
    }

    // Collect common filters that are not 'flag' and 'vessel-groups'
    // as we will have the vessel-group in all of them when added from report
    const firstDataviewGenericFilterKeys =
      dataviews[0].config && dataviews[0].config?.filters
        ? (Object.keys(dataviews[0].config?.filters) as SupportedDatasetSchema[]).filter(
            (key) => key !== 'flag' && key !== 'vessel-groups'
          )
        : ([] as SupportedDatasetSchema[])

    const genericFilters: Record<string, string>[] = []
    const genericExcludedFilters: Record<string, string>[] = []
    firstDataviewGenericFilterKeys.forEach((filterKey) => {
      const firstDataviewGenericFilterFields = getSerializedFilterFields(dataviews[0], filterKey)
      if (
        dataviews?.every((dataview) => {
          const genericFilterFields = getSerializedFilterFields(dataview, filterKey)
          return genericFilterFields === firstDataviewGenericFilterFields
        }) &&
        !ALWAYS_SHOWN_FILTERS.includes(filterKey)
      ) {
        const keyLabelField = FIELDS.find((field) => field[0] === filterKey)
        const keyLabel = keyLabelField
          ? t(keyLabelField[1] as any, keyLabelField[2] as string).toLocaleLowerCase()
          : filterKey

        const valuesLabel = getSchemaFieldsSelectedInDataview(
          dataviews[0],
          filterKey as SupportedDatasetSchema
        )
          .map((f: any) => f.label?.toLocaleLowerCase())
          .join(', ')

        if (getSchemaFilterOperationInDataview(dataviews[0], filterKey) === EXCLUDE_FILTER_ID) {
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
