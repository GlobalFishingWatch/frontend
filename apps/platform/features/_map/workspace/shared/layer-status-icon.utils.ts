import type { IconButtonType, IconType } from '@globalfishingwatch/ui-components'

type LayerStatus = {
  deleted?: boolean
  deprecated?: boolean
  error?: boolean
}

type LayerStatusIcon = {
  icon: IconType
  type: IconButtonType
}

// Same precedence in every layer panel: deleted datasets > outdated data > loading error
export const getLayerStatusIcon = ({
  deleted,
  deprecated,
  error,
}: LayerStatus): LayerStatusIcon | undefined => {
  if (deleted) {
    return { icon: 'warning', type: 'warning-invert' }
  }
  if (deprecated) {
    return { icon: 'update-required', type: 'update-required' }
  }
  if (error) {
    return { icon: 'warning', type: 'warning' }
  }
}

// The "more" button only reflects the layer status while active, except for deleted datasets
export const getLayerMoreIcon = ({
  layerActive,
  deleted,
  deprecated,
  error,
}: LayerStatus & { layerActive: boolean }): { icon?: IconType; type: IconButtonType } =>
  getLayerStatusIcon({
    deleted,
    deprecated: layerActive && deprecated,
    error: layerActive && error,
  }) || { icon: layerActive ? 'more' : undefined, type: 'default' }
