export { default } from './use-map-interaction'

export type ExtendedFeature = {
  properties: { [name: string]: any }
  source: string
  sourceLayer: string
  generator: string | null
  generatorId: string | number | null
  id?: number
  value: any
}

export type InteractionEvent = {
  features?: ExtendedFeature[]
  latitude: number
  longitude: number
}
