import { AnyGeneratorConfig } from './types'

export function isConfigVisible(config: AnyGeneratorConfig) {
  return config.visible !== undefined ? (config.visible ? 'visible' : 'none') : 'visible'
}
