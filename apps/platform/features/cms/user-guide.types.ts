import type { USER_GUIDE_SECTIONS } from '@platform/config/user-guide'

import type { StrapiBaseAttributes, StrapiImage } from 'features/cms/strapi.types'

export type UserGuideSectionSlug = keyof typeof USER_GUIDE_SECTIONS

type SubSectionArrays = (typeof USER_GUIDE_SECTIONS)[UserGuideSectionSlug]
export type UserGuideSubSectionSlug = SubSectionArrays[number]

export type UserGuideSlug = UserGuideSectionSlug | UserGuideSubSectionSlug

export type UserGuideContent = UserGuideSection[]

export type UserGuideSection = StrapiBaseAttributes & {
  title: string
  slug: UserGuideSectionSlug
  thumbnail?: StrapiImage
  body?: string
  subsections?: UserGuideSubSection[]
}

export type UserGuideSubSection = StrapiBaseAttributes & {
  title: string
  body: string
  slug: UserGuideSubSectionSlug
}
