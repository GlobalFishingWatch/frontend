import { DatasetTypes, DataviewInstance } from '@globalfishingwatch/api-types'
import { resolveDataviewDatasetResource } from '@globalfishingwatch/dataviews-client'
import { DeckResolverFunction } from './types'

type TileClusterDeckLayerProps = any

export const resolveDeckTileClusterLayerProps: DeckResolverFunction<TileClusterDeckLayerProps> = (
  dataview
) => {
  const { dataset: tileClusterDataset, url: tileClusterUrl } = resolveDataviewDatasetResource(
    dataview,
    DatasetTypes.Events
  )

  if (!tileClusterDataset || !tileClusterUrl) {
    console.warn('No dataset config for TileCluster generator', dataview)
    return []
  }
  return {
    id: dataview.id,
    tilesUrl: tileClusterUrl,
    color: dataview.config?.color,
    // ...(highlightedEvent && { currentEventId: highlightedEvent.id }),
    // ...(highlightedEvents && { currentEventId: highlightedEvents[0] }),
  }
}
