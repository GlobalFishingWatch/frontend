import type { CardProps } from '@globalfishingwatch/ui-components/card'

import type { UserGuideContent } from 'features/cms/loaders/user-guide.types'
import type { StrapiImage } from 'features/cms/strapi.types'
import type { HelpHubTopic } from 'features/help/helpHub.types'

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
