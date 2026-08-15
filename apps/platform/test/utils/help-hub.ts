import type { DataUpdateContent } from 'features/cms/loaders/data-update.types'
import type { UseCaseContent } from 'features/cms/loaders/use-case.types'
import type { UserGuideContent } from 'features/cms/loaders/user-guide.types'
import type { StrapiBaseAttributes, StrapiImage } from 'features/cms/strapi.types'

/**
 * Fixtures + DOM helpers for HelpHub.spec.tsx.
 *
 * The Help Hub renders Strapi content, so every spec stubs the three CMS loaders
 * (`features/cms/loaders/{user-guide,use-case,data-update}`) rather than hitting the real CMS.
 * Stubbing the loaders instead of the RTK Query hooks keeps the query lifecycle real, which is what
 * the loading and error specs assert on.
 */

// Served by `publicAssetsPlugin` from apps/platform/public, so these load for real in the browser
// instead of rendering as broken images with a zero-size box.
export const THUMBNAIL_URL = '/icons/android-chrome-192x192.png'
export const MARKDOWN_IMAGE_URL = '/icons/android-chrome-256x256.png'
export const MARKDOWN_IMAGE_ALT = 'Vessel track example'

/** Appears exactly once across the whole fixture set, in the Detections body. */
export const SEARCH_TERM = 'synthetic'

// Each topic has to be taller than the 720px viewport: both the deep-link jump and the
// IntersectionObserver that rewrites the URL as you scroll are no-ops in a container that fits.
const filler = (subject: string) =>
  Array.from(
    { length: 25 },
    (_, index) => `Paragraph ${index + 1} of the ${subject} reference material.`
  ).join('\n\n')

const strapiBase = (id: string): StrapiBaseAttributes => ({
  id,
  documentId: `doc-${id}`,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  publishedAt: '2026-01-01T00:00:00.000Z',
  locale: 'en',
  localizations: [],
})

const thumbnail = (id: number, alternativeText: string): StrapiImage => ({
  id,
  documentId: `img-${id}`,
  alternativeText,
  url: THUMBNAIL_URL,
})

/**
 * Slugs are the real `CATEGORIES_CONFIG` keys so the fixture typechecks against
 * `UserGuideSectionSlug` / `UserGuideSubSectionSlug`.
 *
 * Shape that the specs depend on:
 * - `introduction` is first, so it is the implicit active topic when the URL carries no topicSlug.
 * - `vessels` is the only topic with subsections (expand-button specs) and the only one whose body
 *   holds a markdown image (image-expansion spec).
 * - `detections` is the only match for SEARCH_TERM, and is deliberately NOT last: scrolling a
 *   trailing topic to the top of the container is not always possible, which would make the
 *   scroll-driven URL sync ambiguous.
 */
export const USER_GUIDE_FIXTURE: UserGuideContent = [
  {
    ...strapiBase('1'),
    title: 'Introduction',
    slug: 'introduction',
    thumbnail: thumbnail(1, 'Introduction thumbnail'),
    body: `Start here for an overview of the map.\n\n${filler('introduction')}`,
  },
  {
    ...strapiBase('2'),
    title: 'Vessels',
    slug: 'vessels',
    body: `![${MARKDOWN_IMAGE_ALT}](${MARKDOWN_IMAGE_URL})\n\nHow vessel layers behave.\n\n${filler('vessel')}`,
    subsections: [
      {
        ...strapiBase('21'),
        title: 'Vessel profile',
        slug: 'vessel-profile',
        body: 'The vessel profile gathers identity and activity in one page.',
      },
      {
        ...strapiBase('22'),
        title: 'Vessel search',
        slug: 'vessel-search',
        body: 'Vessel search looks up a vessel by name, MMSI or IMO.',
      },
    ],
  },
  {
    ...strapiBase('3'),
    title: 'Detections',
    slug: 'detections',
    body: `Radar detections come from ${SEARCH_TERM} aperture radar imagery.\n\n${filler('detection')}`,
  },
  {
    ...strapiBase('4'),
    title: 'Disclaimer',
    slug: 'disclaimer',
    body: `Terms covering the use of this data.\n\n${filler('disclaimer')}`,
  },
]

export const USE_CASES_FIXTURE: UseCaseContent = [
  {
    ...strapiBase('10'),
    role: 'Journalists',
    slug: 'journalists',
    thumbnail: thumbnail(10, 'Journalists thumbnail'),
    body: 'How newsrooms use the map.',
  },
  {
    // No thumbnail on purpose — exercises the card image falling back to the first body image.
    ...strapiBase('11'),
    role: 'Researchers',
    slug: 'researchers',
    body: `<img src="${THUMBNAIL_URL}" alt="Researchers thumbnail" />\n\nHow research teams use the map.`,
  },
]

export const DATA_UPDATES_FIXTURE: DataUpdateContent = [
  {
    ...strapiBase('20'),
    title: 'AIS coverage update',
    slug: 'ais-coverage-update',
    publication_date: '2026-02-10',
    thumbnail: thumbnail(20, 'AIS coverage thumbnail'),
  },
]

// ── DOM helpers ───────────────────────────────────────────────────────────────
//
// The Help Hub markup carries no data-testid attributes, so scope by CSS-module class fragment —
// the same approach Reports.spec.tsx uses with [class*="summaryContainer"]. Vite keeps the authored
// name in the generated class, so `[class*="listItemRow"]` matches `_listItemRow_a1b2c`.

/** The landing page `<section>` whose `<h2>` is `title`. */
export function landingSection(title: string) {
  return Array.from(document.querySelectorAll('section')).find(
    (section) => section.querySelector('h2')?.textContent?.trim() === title
  )
}

/** The table-of-contents row for a topic: its title button plus, if any, its expand button. */
export function tocRow(title: string) {
  return Array.from(document.querySelectorAll<HTMLElement>('[class*="listItemRow"]')).find(
    (row) => row.textContent?.trim() === title
  )
}

export function tocRowButtons(title: string) {
  return Array.from(tocRow(title)?.querySelectorAll('button') ?? [])
}

export function tocRowTitles() {
  return Array.from(document.querySelectorAll<HTMLElement>('[class*="listItemRow"]')).map((row) =>
    row.textContent?.trim()
  )
}

export function activeTocTitle() {
  return document.querySelector('[class*="listItemActive"]')?.textContent?.trim()
}

export function highlightedTexts() {
  return Array.from(document.querySelectorAll('[class*="highlighted"]')).map(
    (element) => element.textContent
  )
}

export function imagesWithSrc(src: string) {
  return Array.from(document.querySelectorAll<HTMLImageElement>(`img[src="${src}"]`))
}

export function spinners() {
  return Array.from(document.querySelectorAll('svg[class*="spinner"]'))
}
