import type { Visibility } from '@globalfishingwatch/mapbox-gl'
import { AnyGeneratorConfig } from './types'

export function isConfigVisible(config: AnyGeneratorConfig): Visibility {
  return config.visible !== undefined && config.visible !== null
    ? config.visible
      ? 'visible'
      : 'none'
    : 'visible'
}
