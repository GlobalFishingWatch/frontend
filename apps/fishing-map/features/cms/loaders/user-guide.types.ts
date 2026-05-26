import type { StrapiBaseAttributes } from 'features/cms/strapi.types'

export type UserGuideSectionSlug =
  | 'introduction'
  | 'accessing-the-map'
  | 'registering-and-accessibility'
  | 'profile'
  | 'support'
  | 'activity-fishing'
  | 'reference-layers'
  | 'uploading-data'
  | 'analysis-and-dynamic-reports'
  | 'marine-manager-portal'
  | 'carrier-vessel-portal'
  | 'main-areas-of-the-map'
  | 'activity-vessel-presence'
  | 'vessels'
  | 'detections'
  | 'encounters'
  | 'sharing-information'
  | 'additional-global-fishing-watch-tools'
  | 'disclaimer'

export type UserGuideSubSectionSlug =
  | 'checking-that-you-are-logged-in'
  | 'changing-languages'
  | 'contacting-global-fishing-watch'
  | 'understanding-apparent-fishing-effort-using-ais-and-vms-data'
  | 'filtering-activity-layers'
  | 'step-by-step-filtering-by-gear-type'
  | 'bivariate-analysis-mode'
  | 'step-by-step-comparison-of-fishing-activity-between-fishing-effort-layers'
  | 'adding-layers'
  | 'analyzing-activity-over-time'
  | 'exploring-vessels-within-an-area-of-interest'
  | 'step-by-step-exploring-the-difference-in-fishing-activity-over-time-within-an-eez'
  | 'central-section-showing-spatial-activity-maps'
  | 'timebar'
  | 'left-sidebar'
  | 'information-on-activity-layers'
  | 'animating'
  | 'viewing-vessel-activity-in-layers'
  | 'vessel-profile'
  | 'vessel-search'
  | 'step-by-step-search-for-a-vessel'
  | 'vessel-groups'
  | 'ais-tracks-false-locations-or-spoofing'
  | 'animating'
  | 'radar-detections-synthetic-aperture-radar'
  | 'night-light-detections-visible-infrared-imaging-radiometer-suite'
  | 'step-by-step-radar-and-night-light-detections'
  | 'encounter-events-for-carrier-fishing-vessels-ais'
  | 'step-by-step-vessel-encounters'
  | 'saving-and-sharing-workspaces'
  | 'downloading-data'
  | 'step-by-step-downloading-fishing-activity-from-an-eez'
  | 'data-download-portal'
  | 'citing-global-fishing-watch'
  | 'additional-features'
  | 'nomenclature-of-countries-and-areas'
  | 'use'

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
