import { DateTime } from 'luxon'

import type { Dataset } from '@globalfishingwatch/api-types'
import type { SupportedDatasetFilter } from '@globalfishingwatch/datasets-client'
import { getDatasetFilterItem } from '@globalfishingwatch/datasets-client'
import type { ContextPickingObject, UserLayerPickingObject } from '@globalfishingwatch/deck-layers'

import { getDatasetLabel } from 'features/datasets/datasets.utils'
import { t } from 'features/i18n/i18n'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { OFFSHORE_FIXED_INFRASTRUCTURE_LAYER_ID } from 'features/map/map.config'
import { isTimestampNumber } from 'utils/dates'

const HIDDEN_KEYS = new Set(['gfw_id', 'bbox', 'layerName'])
const getCleanPropertiesList = (properties: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(properties)
      .filter(([k]) => !HIDDEN_KEYS.has(k))
      .sort(([a], [b]) => a.localeCompare(b))
  )
}

const parsePropertiesList = (properties: Record<string, any>, dataset?: Dataset): string => {
  return Object.entries(properties)
    .flatMap(([prop, value]) => {
      const propertyFilterType = dataset
        ? getDatasetFilterItem(dataset, prop as SupportedDatasetFilter)?.type
        : null
      const valueFormatted =
        propertyFilterType === 'timestamp' || isTimestampNumber(Number(value))
          ? formatI18nDate(Number(value), { format: DateTime.DATETIME_MED })
          : value
      return value ? `${prop}: ${valueFormatted}` : []
    })
    .join('<br/>')
}

export const getContextValue = (
  feature: ContextPickingObject | UserLayerPickingObject,
  dataset?: Dataset
): string => {
  const valueProperties = feature?.valueProperties || ([] as string[])
  if (!valueProperties || !valueProperties.length) {
    return feature.properties.value
  }
  if (valueProperties.length === 1) {
    return feature.properties?.[valueProperties[0]] ?? (feature.value as string)
  }
  const selectedProperties = Object.fromEntries(
    valueProperties.map((prop) => [prop, feature.properties?.[prop]])
  )
  return parsePropertiesList(selectedProperties, dataset)
}

export function getContextLayerId(feature: ContextPickingObject | UserLayerPickingObject) {
  const { gfw_id } = feature.properties
  let id = `${feature.value}-${gfw_id}}`
  if (feature.layerId.includes(OFFSHORE_FIXED_INFRASTRUCTURE_LAYER_ID)) {
    id = `${feature.properties.id}-${gfw_id}`
  }
  return id
}

export function getUserContextLayerLabel(
  feature: ContextPickingObject | UserLayerPickingObject,
  dataset?: Dataset
) {
  if (feature.layerId.includes(OFFSHORE_FIXED_INFRASTRUCTURE_LAYER_ID)) {
    const startDate = Number(feature.properties.structure_start_date)
    const endDate = Number(feature.properties.structure_end_date)
    const i18nParams = { format: { month: 'long', year: 'numeric' } }
    const rangeLabel =
      startDate && endDate
        ? t((t) => t.common.timerangeDescription, {
            start: formatI18nDate(startDate, i18nParams),
            end: formatI18nDate(endDate, i18nParams),
          })
        : `${t((t) => t.common.since)} ${formatI18nDate(startDate, i18nParams)}`
    return `${feature.properties.label} - ${feature.properties.label_confidence} ${t(
      (t) => t.common.confidence
    )} (${rangeLabel})`
  }
  if (feature.subcategory === 'draw-polygons' || feature.subcategory === 'draw-points') {
    return dataset ? getDatasetLabel(dataset) : feature.layerId
  }

  const label = getContextValue(feature)
  if (label) {
    return label
  }

  const cleanValueProperties = getCleanPropertiesList(feature.properties)
  if (Object.keys(cleanValueProperties).length >= 1) {
    return parsePropertiesList(cleanValueProperties, dataset)
  }

  return dataset ? getDatasetLabel(dataset) : feature.layerId
}
