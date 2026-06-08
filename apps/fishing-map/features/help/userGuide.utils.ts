import type {
  UserGuideSectionSlug,
  UserGuideSlug,
  UserGuideSubSectionSlug,
} from 'features/cms/loaders/user-guide.types'
import { CATEGORIES_CONFIG } from 'features/cms/loaders/user-guide.types'

export function findSectionForSlug(slug: UserGuideSlug | string): {
  section: UserGuideSectionSlug
  subSection?: UserGuideSubSectionSlug
} | null {
  if (!slug) {
    return null
  }
  if (slug in CATEGORIES_CONFIG) {
    return { section: slug as UserGuideSectionSlug }
  }
  for (const [section, subsections] of Object.entries(CATEGORIES_CONFIG) as [
    UserGuideSectionSlug,
    readonly string[],
  ][]) {
    if (subsections.includes(slug)) {
      return { section, subSection: slug as UserGuideSubSectionSlug }
    }
  }
  return null
}
