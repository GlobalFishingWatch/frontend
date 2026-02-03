import { scaleLinear } from 'd3-scale'

import type {
  Dataset,
  DatasetConfiguration,
  DatasetConfigurationByType,
  DatasetFilter,
  DatasetFilters,
  DatasetGeometryType,
  FrontendConfiguration,
} from '@globalfishingwatch/api-types'
import { DRAW_DATASET_SOURCE } from '@globalfishingwatch/api-types'

// Got from deck-layers colorRamps to avoid circular dependencies
export const COLOR_RAMP_DEFAULT_NUM_STEPS = 10
export type DataList = Record<string, any>[]

export type DatasetSchemaGeneratorProps = {
  data: DataList
}

export type DatasetConfigurationProperty = keyof FrontendConfiguration

type DatasetProperty<P extends DatasetConfigurationProperty> = Required<FrontendConfiguration>[P]

export function getDatasetConfigurationProperty<P extends DatasetConfigurationProperty>({
  dataset,
  property,
  type,
}: {
  dataset: Partial<Dataset> | undefined
  property: P
  type?: 'frontend'
}): DatasetProperty<P> | undefined
export function getDatasetConfigurationProperty<
  T extends Exclude<keyof DatasetConfigurationByType, 'frontend'>,
  P extends keyof NonNullable<DatasetConfigurationByType[T]>,
>({
  dataset,
  property,
  type,
}: {
  dataset: Partial<Dataset> | undefined
  property: P
  type: T
}): NonNullable<DatasetConfigurationByType[T]>[P] | undefined
export function getDatasetConfigurationProperty<P extends string>({
  dataset,
  property,
  type = 'frontend',
}: {
  dataset: Partial<Dataset> | undefined
  property: P
  type?: keyof DatasetConfigurationByType
}) {
  const configuration = dataset?.configuration?.[type] as Record<string, unknown> | undefined

  const configurationValue = configuration?.[property]
  if (configurationValue !== undefined) {
    return configurationValue
  }

  // Backward compatibility: older datasets might have FrontendConfiguration flattened at root.
  if (type === 'frontend') {
    const legacyValue = (dataset?.configuration as any)?.[property]
    if (legacyValue !== undefined) {
      return legacyValue
    }
  }

  return undefined
}

export const getDatasetConfiguration = <T extends keyof DatasetConfiguration = 'frontend'>(
  dataset: Partial<Dataset> | undefined,
  configurationType: T = 'frontend' as T
): NonNullable<DatasetConfiguration[T]> => {
  return (dataset?.configuration?.[configurationType] ?? {}) as NonNullable<DatasetConfiguration[T]>
}

export function getDatasetGeometryType(dataset?: Dataset) {
  if (!dataset) {
    return '' as DatasetGeometryType
  }
  if (dataset?.source === DRAW_DATASET_SOURCE) {
    return 'draw'
  }
  return getDatasetConfigurationProperty({
    dataset,
    property: 'geometryType',
  })
}

export const getEnvironmentalDatasetRange = (dataset: Dataset) => {
  const configuration = dataset?.configuration
  const max = configuration?.frontend?.max ?? (configuration as any)?.max
  const min = configuration?.frontend?.min ?? (configuration as any)?.min
  const scale = (configuration as any)?.scale ?? 1

  // Using Math.max to ensure we don't show negative values as 4wings doesn't support them yet
  // TODO use offset again once the whole app understand the values
  // const cleanMin = Math.max(0, Math.floor(min * scale + offset))
  // const cleanMax = Math.ceil(max * scale + offset)
  const cleanMin = Math.max(0, Math.floor((min ?? 0) * scale))
  const cleanMax = Math.ceil((max ?? 0) * scale)
  return {
    min: cleanMin,
    max: cleanMax,
  }
}

export const getDatasetRangeSteps = ({ min, max }: { min: number; max: number }) => {
  const rampScale = scaleLinear()
    .range([min, max || min + 0.00001])
    .domain([0, 1])
  const numSteps = COLOR_RAMP_DEFAULT_NUM_STEPS
  const steps = [...Array(numSteps)]
    .map((_, i) => i / (numSteps - 1))
    .map((value) => rampScale(value) as number)
  return steps
}

export const getFlattenDatasetFilters = (
  filters: DatasetFilters | null | undefined
): DatasetFilter[] => {
  if (!filters) return []

  return Object.values(filters).flatMap((typeFilters) => {
    return Array.isArray(typeFilters) ? typeFilters : []
  })
}
