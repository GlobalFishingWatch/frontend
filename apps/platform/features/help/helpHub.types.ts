import type { StrapiImage } from 'features/cms/strapi.types'

export type HelpHubItemSubsection = {
  id: string
  slug?: string
  title: string
  body?: string
}

export type HelpHubItem = {
  id: string
  slug: string
  title: string
  description?: string
  thumbnail?: StrapiImage
  body?: string
  subsections?: HelpHubItemSubsection[]
}
