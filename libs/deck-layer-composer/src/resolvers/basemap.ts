import { DataviewInstance } from '@globalfishingwatch/api-types'
import { BaseMapLayerProps } from '@globalfishingwatch/deck-layers'

export function resolveDeckBasemapLayerProps(dataview: DataviewInstance): BaseMapLayerProps {
  return {
    id: dataview.id,
    visible: dataview.config?.visible || true,
    basemap: dataview.config?.basemap || 'default',
  }
}
