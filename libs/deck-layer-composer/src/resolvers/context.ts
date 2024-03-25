import { PickingInfo } from '@deck.gl/core'
import { DatasetTypes, DataviewInstance } from '@globalfishingwatch/api-types'
import { ContextLayerProps, EEZLayerProps } from '@globalfishingwatch/deck-layers'
import { resolveDataviewDatasetResource } from '@globalfishingwatch/dataviews-client'
import { ResolverGlobalConfig } from '../resolvers/types'

export function resolveDeckContextLayerProps(
  dataview: DataviewInstance,
  globalConfig: ResolverGlobalConfig,
  interactions: PickingInfo[]
): ContextLayerProps {
  // TODO make this work for auxiliar layers
  // https://github.com/GlobalFishingWatch/frontend/blob/master/libs/dataviews-client/src/resolve-dataviews-generators.ts#L606
  const { url } = resolveDataviewDatasetResource(dataview, DatasetTypes.TemporalContext)
  if (!url) {
    console.warn('No url found for temporal context')
  }

  return {
    id: dataview.id,
    category: dataview.category!,
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
