import { Dataset } from '@globalfishingwatch/api-types'
import {
  getDatasetConfigurationProperty,
  getDatasetRangeSteps,
} from '@globalfishingwatch/datasets-client'
import { GeneratorDataviewConfig } from '@globalfishingwatch/layer-composer'

export const setGeneratorConfigCircleRadius = ({
  dataset,
  generator,
}: {
  dataset: Dataset
  generator: GeneratorDataviewConfig
}) => {
  const circleRadiusProperty = getDatasetConfigurationProperty({
    dataset,
    property: 'pointSize',
  })
  if (circleRadiusProperty) {
    generator.circleRadiusProperty = circleRadiusProperty.toLowerCase()
    generator.circleRadiusRange = circleRadiusProperty && [
      dataset.schema?.[circleRadiusProperty].enum?.[0],
      dataset.schema?.[circleRadiusProperty].enum?.[1],
    ]
    generator.minPointSize = getDatasetConfigurationProperty({
      dataset,
      property: 'minPointSize',
    })
    generator.maxPointSize = getDatasetConfigurationProperty({
      dataset,
      property: 'maxPointSize',
    })
  }
}

export const setGeneratorConfigTimeFilter = ({
  dataset,
  generator,
}: {
  dataset: Dataset
  generator: GeneratorDataviewConfig
}) => {
  const startTimeFilterProperty = getDatasetConfigurationProperty({
    dataset,
    property: 'startTime',
  })
  console.log('🚀 ~ startTimeFilterProperty:', startTimeFilterProperty)
  const endTimeFilterProperty = getDatasetConfigurationProperty({
    dataset,
    property: 'endTime',
  })
  if (startTimeFilterProperty) {
    generator.startTimeFilterProperty = startTimeFilterProperty
  }
  if (endTimeFilterProperty) {
    generator.endTimeFilterProperty = endTimeFilterProperty
  }
}

export const setGeneratorConfigPolygonColor = ({
  dataset,
  generator,
}: {
  dataset: Dataset
  generator: GeneratorDataviewConfig
}) => {
  const polygonColor = getDatasetConfigurationProperty({
    dataset,
    property: 'polygonColor',
  })

  if (dataset?.schema?.[polygonColor]?.enum) {
    const [min, max] = dataset.schema[polygonColor].enum as number[]
    generator.steps = getDatasetRangeSteps({ min, max })
    generator.pickValueAt = polygonColor
  }
}
