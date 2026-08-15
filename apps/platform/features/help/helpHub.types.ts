import type { StrapiImage } from 'features/cms/strapi.types'

export type HelpHubTopicSubsection = {
  id: string
  slug?: string
  title: string
  body?: string
}

export type HelpHubTopic = {
  id: string
  slug: string
  title: string
  description?: string
  thumbnail?: StrapiImage
  body?: string
  subsections?: HelpHubTopicSubsection[]
}
