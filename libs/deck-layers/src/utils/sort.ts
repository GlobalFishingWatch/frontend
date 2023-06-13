import { indexOf } from 'lodash'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import { FourwingsLayer } from '@globalfishingwatch/deck-layers'

export const HEATMAP_GROUP_ORDER: DataviewCategory[] = [
  DataviewCategory.Activity,
  DataviewCategory.Detections,
  DataviewCategory.Environment,
]

export const sortFourwingsLayers = (a: FourwingsLayer, b: FourwingsLayer) =>
  indexOf(HEATMAP_GROUP_ORDER, b.props.category) - indexOf(HEATMAP_GROUP_ORDER, a.props.category)
