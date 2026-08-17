import type { CardProps } from '@globalfishingwatch/ui-components/card'

import type { DataUpdateContent } from 'features/cms/loaders/data-update.types'
import type { UseCaseContent } from 'features/cms/loaders/use-case.types'
import type { UserGuideContent } from 'features/cms/loaders/user-guide.types'
import type { StrapiBaseAttributes, StrapiImage } from 'features/cms/strapi.types'
import { HELP_HUB_SECTIONS } from 'features/help/helpHub.config'
import type {
  HelpHubItem,
  HelpHubItemSubsection,
  HelpHubSection,
} from 'features/help/helpHub.types'

export function findHelpHubSection(slug: string | undefined): HelpHubSection | undefined {
  if (!slug) {
    return undefined
  }
  return HELP_HUB_SECTIONS.find((section) => section.slug === slug)
}

const toSubsections = (
  subsections?: (StrapiBaseAttributes & {
    title: string
    slug: string
    body?: string
  })[]
): HelpHubItemSubsection[] | undefined =>
  subsections?.map((subsection) => ({
    id: subsection.id.toString(),
    slug: subsection.slug,
    title: subsection.title,
    body: subsection.body,
  }))

export function toUserGuideItems(sections: UserGuideContent): HelpHubItem[] {
  return sections.map((section) => ({
    id: section.id.toString(),
    slug: section.slug || section.id.toString(),
    title: section.title,
    thumbnail: section.thumbnail,
    body: section.body,
    subsections: toSubsections(section.subsections),
  }))
}

export function toUseCaseItems(sections: UseCaseContent): HelpHubItem[] {
  return sections.map((section) => ({
    id: section.id.toString(),
    slug: section.slug || section.id.toString(),
    title: section.role,
    thumbnail: section.thumbnail,
    body: section.body,
    subsections: toSubsections(section.subsections),
  }))
}

export function toDataUpdateItems(updates: DataUpdateContent): HelpHubItem[] {
  return updates.map((update) => ({
    id: update.id.toString(),
    slug: update.slug || update.id.toString(),
    title: update.title,
    thumbnail: update.thumbnail,
    body: update.body,
    publicationDate: update.publication_date,
  }))
}

// Bodies are markdown but render with allowHtml, so media can be either syntax.
// One alternation keeps whichever comes first in the body, no g flag to avoid a shared lastIndex.
const BODY_IMAGE_REGEX =
  /!\[([^\]]*)\]\(\s*(?:<([^>]*)>|([^\s)]+))[^)]*\)|<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/i
const HTML_ALT_REGEX = /\balt=["']([^"']*)["']/i

// Fall back to the first image in the body when the CMS entry has no thumbnail.
const getFirstBodyImage = (body?: string): CardProps['image'] => {
  const match = body ? BODY_IMAGE_REGEX.exec(body) : null
  if (!match) return undefined
  const [tag, markdownAlt, angleUrl, plainUrl, htmlUrl] = match
  const markdownUrl = angleUrl || plainUrl
  const url = markdownUrl || htmlUrl
  if (!url) return undefined
  const alt = markdownUrl ? markdownAlt : HTML_ALT_REGEX.exec(tag)?.[1]
  return { url, alt: alt || undefined }
}

// Card takes { url, alt }; Strapi media carries the text as alternativeText.
export const getCardImage = (thumbnail?: StrapiImage, body?: string): CardProps['image'] =>
  thumbnail
    ? { url: thumbnail.url, alt: thumbnail.alternativeText ?? undefined }
    : getFirstBodyImage(body)
