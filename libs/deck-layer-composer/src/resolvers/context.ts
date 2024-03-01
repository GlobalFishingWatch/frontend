import { DataviewInstance } from '@globalfishingwatch/api-types'
import { BaseMapLayerProps, ContextLayerProps } from '@globalfishingwatch/deck-layers'

export function resolveDeckContextLayerProps(dataview: DataviewInstance): ContextLayerProps {
  return {
    id: dataview.id,
    color: dataview.config?.color!,
    datasetId: dataview.config?.layers?.[0].dataset!,
    // hoveredFeatures,
    // clickedFeatures,
  }
}
