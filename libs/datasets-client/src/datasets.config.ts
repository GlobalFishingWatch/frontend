import { scaleLinear } from 'd3-scale'

import type {
  Dataset,
  DatasetConfiguration,
  DatasetConfigurationUI,
  DatasetGeometryType,
  EnviromentalDatasetConfiguration} from '@globalfishingwatch/api-types';
import {
  DRAW_DATASET_SOURCE
} from '@globalfishingwatch/api-types'

// Got from deck-layers colorRamps to avoid circular dependencies
export const COLOR_RAMP_DEFAULT_NUM_STEPS = 10
export type DataList = Record<string, any>[]

export type DatasetSchemaGeneratorProps = {
  data: DataList
}

export type MergedDatasetConfig = DatasetConfigurationUI & DatasetConfiguration
export type DatasetConfigurationProperty = keyof MergedDatasetConfig

type DatasetProperty<P extends DatasetConfigurationProperty> = Required<MergedDatasetConfig>[P]
export function getDatasetConfigurationProperty<P extends DatasetConfigurationProperty>({
  dataset,
  property,
}: {
  dataset: Partial<Dataset> | undefined
  property: P
}): DatasetProperty<P> {
  return (dataset?.configuration?.configurationUI?.[property as keyof DatasetConfigurationUI] ||
    dataset?.configuration?.[property as keyof DatasetConfiguration]) as DatasetProperty<P>
}

export const getDatasetConfiguration = (
  dataset: Partial<Dataset> | undefined
): DatasetConfiguration & DatasetConfiguration['configurationUI'] => ({
  ...(dataset?.configuration || ({} as DatasetConfiguration)),
  ...(dataset?.configuration?.configurationUI || ({} as DatasetConfiguration['configurationUI'])),
})

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
  const {
    max,
    min,
    scale = 1,
    offset = 0,
  } = dataset?.configuration as EnviromentalDatasetConfiguration

  // Using Math.max to ensure we don't show negative values as 4wings doesn't support them yet
  // TODO use offset again once the whole app understand the values
  // const cleanMin = Math.max(0, Math.floor(min * scale + offset))
  // const cleanMax = Math.ceil(max * scale + offset)
  const cleanMin = Math.max(0, Math.floor(min * scale))
  const cleanMax = Math.ceil(max * scale)
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
