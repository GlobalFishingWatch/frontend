import type { StrapiBaseAttributes } from 'features/cms/strapi.types'

export type DataTerminology = StrapiBaseAttributes & {
  title?: string
  terminologyKey: string
  description: string
}
