export const HELP_HUB_SECTIONS = [
  { id: 'toolsAndFeatures', slug: 'tools-and-features' },
  { id: 'useCases', slug: 'use-cases' },
  { id: 'platformAndUpdates', slug: 'platform-and-updates' },
] as const

export type HelpHubSection = (typeof HELP_HUB_SECTIONS)[number]
export type HelpHubSectionId = HelpHubSection['id']
export type HelpHubSectionSlug = HelpHubSection['slug']

export function findHelpHubSection(slug: string | undefined): HelpHubSection | undefined {
  if (!slug) {
    return undefined
  }
  return HELP_HUB_SECTIONS.find((section) => section.slug === slug)
}
