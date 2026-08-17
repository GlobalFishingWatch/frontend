import type { StrapiImage } from 'features/cms/strapi.types'
import type { HELP_HUB_SECTIONS } from 'features/help/helpHub.config'

export type HelpHubSection = (typeof HELP_HUB_SECTIONS)[number]
export type HelpHubSectionId = HelpHubSection['id']
export type HelpHubSectionSlug = HelpHubSection['slug']

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
  publicationDate?: string
  subsections?: HelpHubItemSubsection[]
}
