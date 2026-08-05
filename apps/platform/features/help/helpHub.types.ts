import type { UserGuideContent } from 'features/cms/loaders/user-guide.types'
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

export function toHelpHubTopics(sections: UserGuideContent): HelpHubTopic[] {
  return sections.map((section) => ({
    id: section.id.toString(),
    slug: section.slug || section.id.toString(),
    title: section.title,
    body: section.body,
    subsections: section.subsections?.map((subsection) => ({
      id: subsection.id.toString(),
      slug: subsection.slug,
      title: subsection.title,
      body: subsection.body,
    })),
  }))
}

export function findHelpHubTopic(
  topics: HelpHubTopic[],
  slug: string | undefined
): HelpHubTopic | undefined {
  if (!slug) {
    return undefined
  }
  return topics.find((topic) => topic.slug === slug)
}
