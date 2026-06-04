import type { StrapiBaseAttributes } from 'features/cms/strapi.types'

export type DataTerminology = StrapiBaseAttributes & {
  title?: string
  slug: string
  description: string
}
