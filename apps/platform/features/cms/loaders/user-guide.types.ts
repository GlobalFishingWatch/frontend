import type { StrapiBaseAttributes } from 'features/cms/strapi.types'

export const CATEGORIES_CONFIG = {
  introduction: [],
  'accessing-the-map': [],
  'registering-and-accessibility': ['checking-that-you-are-logged-in', 'changing-languages'],
  profile: [],
  support: ['contacting-global-fishing-watch'],
  'activity-fishing': [
    'understanding-apparent-fishing-effort-using-ais-and-vms-data',
    'filtering-activity-layers',
    'step-by-step-filtering-by-gear-type',
    'bivariate-analysis-mode',
    'step-by-step-comparison-of-fishing-activity-between-fishing-effort-layers',
  ],
  'reference-layers': [],
  'uploading-data': ['adding-layers'],
  'analysis-and-dynamic-reports': [
    'analyzing-activity-over-time',
    'exploring-vessels-within-an-area-of-interest',
    'step-by-step-exploring-the-difference-in-fishing-activity-over-time-within-an-eez',
  ],
  'marine-manager-portal': [],
  'carrier-vessel-portal': [],
  'main-areas-of-the-map': [
    'central-section-showing-spatial-activity-maps',
    'timebar',
    'left-sidebar',
  ],
  'activity-vessel-presence': ['information-on-activity-layers', 'animating'],
  vessels: [
    'viewing-vessel-activity-in-layers',
    'vessel-profile',
    'vessel-search',
    'step-by-step-search-for-a-vessel',
    'vessel-groups',
    'ais-tracks-false-locations-or-spoofing',
    'animating',
  ],
  detections: [
    'radar-detections-synthetic-aperture-radar',
    'night-light-detections-visible-infrared-imaging-radiometer-suite',
    'step-by-step-radar-and-night-light-detections',
  ],
  encounters: [
    'encounter-events-for-carrier-fishing-vessels-ais',
    'step-by-step-vessel-encounters',
  ],
  'sharing-information': [
    'saving-and-sharing-workspaces',
    'downloading-data',
    'step-by-step-downloading-fishing-activity-from-an-eez',
    'data-download-portal',
    'citing-global-fishing-watch',
    'additional-features',
  ],
  'additional-global-fishing-watch-tools': [],
  disclaimer: ['nomenclature-of-countries-and-areas', 'use'],
} as const

export type UserGuideSectionSlug = keyof typeof CATEGORIES_CONFIG

type SubSectionArrays = (typeof CATEGORIES_CONFIG)[UserGuideSectionSlug]
export type UserGuideSubSectionSlug = SubSectionArrays[number]

export type UserGuideSlug = UserGuideSectionSlug | UserGuideSubSectionSlug

export type UserGuideContent = UserGuideSection[]

export type UserGuideSection = StrapiBaseAttributes & {
  title: string
  body: string
  slug: UserGuideSectionSlug
  subsections: UserGuideSubSection[]
}

export type UserGuideSubSection = StrapiBaseAttributes & {
  title: string
  body: string
  slug: UserGuideSubSectionSlug
}
