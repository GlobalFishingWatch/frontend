import { DateTime } from 'luxon'

import type { DataUpdateContent } from 'features/cms/loaders/data-update.types'
import type { UseCaseContent } from 'features/cms/loaders/use-case.types'
import type { UserGuideContent } from 'features/cms/loaders/user-guide.types'
import type { StrapiImage } from 'features/cms/strapi.types'
import { formatI18nDate } from 'features/i18n/i18nDate.utils'

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

export function toHelpHubTopics(sections: UserGuideContent): HelpHubTopic[] {
  return sections.map((section) => ({
    id: section.id.toString(),
    slug: section.slug || section.id.toString(),
    title: section.title,
    thumbnail: section.thumbnail,
    body: section.body,
    subsections: section.subsections?.map((subsection) => ({
      id: subsection.id.toString(),
      slug: subsection.slug,
      title: subsection.title,
      body: subsection.body,
    })),
  }))
}

export type HelpHubCard = {
  id: string
  slug: string
  title: string
  subtitle?: string
  image?: { url: string; alt?: string }
}

// Bodies are markdown but render with allowHtml, so media can be either syntax.
// One alternation keeps whichever comes first in the body, no g flag to avoid a shared lastIndex.
const BODY_IMAGE_REGEX =
  /!\[([^\]]*)\]\(\s*(?:<([^>]*)>|([^\s)]+))[^)]*\)|<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/i
const HTML_ALT_REGEX = /\balt=["']([^"']*)["']/i

// Fall back to the first image in the body when the CMS entry has no thumbnail.
const getFirstBodyImage = (body?: string): HelpHubCard['image'] => {
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
const toCardImage = (thumbnail?: StrapiImage, body?: string): HelpHubCard['image'] =>
  thumbnail
    ? { url: thumbnail.url, alt: thumbnail.alternativeText ?? undefined }
    : getFirstBodyImage(body)

export function toUserGuideCards(sections: UserGuideContent): HelpHubCard[] {
  return sections.map((section) => ({
    id: section.id.toString(),
    slug: section.slug,
    title: section.title,
    image: toCardImage(section.thumbnail, section.body),
  }))
}

export function toUseCaseCards(sections: UseCaseContent): HelpHubCard[] {
  return sections.map((section) => ({
    id: section.id.toString(),
    slug: section.slug,
    title: section.role,
    image: toCardImage(section.thumbnail, section.body),
  }))
}

export function toDataUpdateCards(updates: DataUpdateContent): HelpHubCard[] {
  return updates.map((update) => ({
    id: update.id.toString(),
    slug: update.slug,
    title: update.title,
    subtitle: update.publication_date
      ? formatI18nDate(update.publication_date, { format: DateTime.DATE_FULL })
      : undefined,
    image: toCardImage(update.thumbnail, update.body),
  }))
}
