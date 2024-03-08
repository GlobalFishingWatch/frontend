import { PickingInfo } from '@deck.gl/core/typed'
import { DataviewInstance } from '@globalfishingwatch/api-types'
import { ContextLayerProps, EEZLayerProps } from '@globalfishingwatch/deck-layers'
import { ResolverGlobalConfig } from '../resolvers/types'

export function resolveDeckContextLayerProps(
  dataview: DataviewInstance,
  globalConfig: ResolverGlobalConfig,
  interactions: PickingInfo[]
): ContextLayerProps {
  return {
    id: dataview.id,
    color: dataview.config?.color!,
    datasetId: dataview.config?.layers?.[0].dataset!,
    idProperty: dataview.datasets?.[0]?.configuration?.idProperty as string,
    hoveredFeatures: interactions,
    // clickedFeatures,
  }
}

export function resolveDeckEEZLayerProps(
  dataview: DataviewInstance,
  globalConfig: ResolverGlobalConfig,
  interactions: PickingInfo[]
): EEZLayerProps {
  return {
    id: dataview.id,
    color: dataview.config?.color!,
    areasDatasetId: dataview.config?.layers?.[0].dataset!,
    boundariesDatasetId: dataview.config?.layers?.[1].dataset!,
    idProperty: dataview.datasets?.[0]?.configuration?.idProperty as string,
    hoveredFeatures: interactions,
    // clickedFeatures,
  }
}
