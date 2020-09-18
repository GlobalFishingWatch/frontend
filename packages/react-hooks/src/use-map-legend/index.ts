export { default } from './use-map-legend'

export type LegendLayerConfig = {
  color: string
}

export type LegendConfig = {
  latitude?: number
  longitude?: number
  layers?: LegendLayerConfig[]
}
