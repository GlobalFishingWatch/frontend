import { DataviewInstance } from '@globalfishingwatch/api-types'
import { ContextLayerProps } from '@globalfishingwatch/deck-layers'
import { GROUP_ORDER, Group } from '@globalfishingwatch/layer-composer'
import { ResolverGlobalConfig } from '../resolvers/types'

export function resolveDeckContextLayerProps(
  dataview: DataviewInstance,
  globalConfig: ResolverGlobalConfig
): ContextLayerProps {
  return {
    id: dataview.id,
    color: dataview.config?.color!,
    datasetId: dataview.config?.layers?.[0].dataset!,
    zIndex: GROUP_ORDER.indexOf(Group.OutlinePolygons),
    // hoveredFeatures,
    // clickedFeatures,
  }
}
