import { USER_GUIDE_SECTIONS } from '@platform/config/user-guide'

import type {
  UserGuideSectionSlug,
  UserGuideSlug,
  UserGuideSubSectionSlug,
} from 'features/cms/loaders/user-guide.types'

export function findSectionForSlug(slug: UserGuideSlug | string): {
  section: UserGuideSectionSlug
  subSection?: UserGuideSubSectionSlug
} | null {
  if (!slug) {
    return null
  }
  if (slug in USER_GUIDE_SECTIONS) {
    return { section: slug as UserGuideSectionSlug }
  }
  for (const [section, subsections] of Object.entries(USER_GUIDE_SECTIONS) as [
    UserGuideSectionSlug,
    readonly string[],
  ][]) {
    if (subsections.includes(slug)) {
      return { section, subSection: slug as UserGuideSubSectionSlug }
    }
  }
  return null
}
