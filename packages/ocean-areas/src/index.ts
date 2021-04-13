import { BBox, Feature, Geometry } from 'geojson'
import sourceLocales from './data/locales/source.json'

export interface OceanAreaProperties {
  type: string
  name: string
  area?: number
  mrgid?: string
  bounds?: BBox
}

export type OceanArea = Feature<Geometry, OceanAreaProperties>

export enum OceanAreaLocale {
  en = 'en',
  es = 'es',
  fr = 'fr',
}

export type OceanAreaLocaleKey = keyof typeof sourceLocales

export * from './ocean-areas'
