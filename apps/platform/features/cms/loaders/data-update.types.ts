import type { StrapiBaseAttributes, StrapiImage } from 'features/cms/strapi.types'

export type DataUpdateContent = DataUpdate[]

export type DataUpdate = StrapiBaseAttributes & {
  title: string
  slug: string
  thumbnail?: StrapiImage
  body?: string
  publication_date: string
}
