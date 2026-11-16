import { PATH_BASENAME, PLATFORM_MODE } from 'data/map/config'
import { WORKSPACE_ENV } from 'data/workspace-env'
import { t } from 'features/i18n/i18n'
import type Resources from 'features/i18n/i18n.types'
import { getIsBrowser } from 'utils/dom'
import { formatInfoField } from 'utils/info'

export type WorkspaceCategoryDescriptionKey =
  keyof Resources['translations']['workspace']['siteDescription']

const PREFIX = 'GFW'
const SITE_ORIGIN =
  {
    production: 'https://globalfishingwatch.org',
    staging: 'https://fishing-map.staging.globalfishingwatch.org',
    development: 'https://fishing-map.dev.globalfishingwatch.org',
  }[WORKSPACE_ENV] ?? (getIsBrowser() ? window.location.origin : 'http://localhost:3003')
const DEFAULT_DESCRIPTION = `Through our free and open data transparency platform, Global Fishing Watch enables research and innovation in support of ocean sustainability.`
const SHARE_IMAGE = `${SITE_ORIGIN}${PATH_BASENAME}/images/gfw.jpg`

export const buildCanonicalUrl = (pathname?: string) => {
  const path = (pathname ?? '').split(/[?#]/)[0]
  const withBase = path.startsWith(PATH_BASENAME) ? path : `${PATH_BASENAME}${path}`
  return `${SITE_ORIGIN}${withBase.length > 1 ? withBase.replace(/\/+$/, '') : withBase}`
}

const getCanonicalPathname = (pathname?: string, params?: Record<string, string | undefined>) =>
  params?.vesselId ? `/vessel/${params.vesselId}` : pathname

/** Single source of `rel=canonical` for the whole app — emitted once, from the root route. */
export const getCanonicalLink = (
  pathname?: string,
  params?: Record<string, string | undefined>
) => ({
  rel: 'canonical',
  href: buildCanonicalUrl(getCanonicalPathname(pathname, params)),
})

const ORGANIZATION_JSON_LD = {
  '@type': 'Organization',
  '@id': 'https://globalfishingwatch.org/#organization',
  name: 'Global Fishing Watch',
  url: 'https://globalfishingwatch.org',
  logo: `${SITE_ORIGIN}${PATH_BASENAME}/icons/android-chrome-512x512.png`,
  sameAs: [
    'https://www.facebook.com/GlobalFishingWatch/',
    'https://twitter.com/GlobalFishWatch',
    'https://www.youtube.com/channel/UCFMjCB4uesIrCmO2G5II5zw',
    'https://www.instagram.com/globalfishingwatch/',
    'https://www.linkedin.com/company/global-fishing-watch/',
  ],
}

/** Site-wide entities for AI and search engines */
const SITE_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    ORGANIZATION_JSON_LD,
    {
      '@type': 'WebSite',
      name: 'Global Fishing Watch Map',
      url: buildCanonicalUrl('/'),
      publisher: { '@id': ORGANIZATION_JSON_LD['@id'] },
    },
  ],
}

// The JSON-LD sits in the same array literal as the plain tags: TS only accepts
// `script:ld+json` in a route's `meta` once the literal union is normalized.
// Identical tags are deduped by the router, so a child calling this again does not repeat it.
export const getDefaultMeta = (title: string, description: string) => ({
  meta: [
    { charSet: 'utf-8' },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, viewport-fit=cover',
    },
    { title },
    {
      property: 'og:description',
      content: description,
    },
    {
      name: 'twitter:description',
      content: description,
    },
    {
      name: 'description',
      content: description,
    },
    { property: 'og:site_name', content: 'Global Fishing Watch' },
    { property: 'og:image', content: SHARE_IMAGE },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: SHARE_IMAGE },
    { name: 'mobile-web-app-capable', content: 'yes' },
    { name: 'theme-color', content: '#163f89' },
    { name: 'application-name', content: 'GFW Fishing map' },
    { name: 'referrer', content: 'no-referrer-when-downgrade' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
    { name: 'apple-mobile-web-app-title', content: 'GFW Fishing map' },
    { name: 'msapplication-TileColor', content: '#fff' },
    { name: 'msapplication-TileImage', content: 'icons/mstile-144x144.png' },
    { name: 'msapplication-config', content: 'icons/browserconfig.xml' },
    { 'script:ld+json': SITE_JSON_LD },
  ],
  links: [
    { rel: 'shortcut icon', href: `${PATH_BASENAME}/icons/favicon.ico` },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: `${PATH_BASENAME}/icons/favicon-16x16.png`,
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: `${PATH_BASENAME}/icons/favicon-32x32.png`,
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '48x48',
      href: `${PATH_BASENAME}/icons/favicon-48x48.png`,
    },
    { rel: 'manifest', href: `${PATH_BASENAME}/icons/manifest.webmanifest` },
    {
      rel: 'apple-touch-icon',
      sizes: '120x120',
      href: `${PATH_BASENAME}/icons/apple-touch-icon-120x120.png`,
    },
    {
      rel: 'apple-touch-icon',
      sizes: '152x152',
      href: `${PATH_BASENAME}/icons/apple-touch-icon-152x152.png`,
    },
    {
      rel: 'apple-touch-icon',
      sizes: '1024x1024',
      href: `${PATH_BASENAME}/icons/apple-touch-icon-1024x1024.png`,
    },
  ],
})

const getHeadTitle = (category: string) => `${PREFIX} | ${category}`

export const getRouteHead = ({
  category,
  description,
}: { category?: string; description?: string } = {}) => {
  const categoryResolved = category ?? t((s) => s.common.map)
  const descriptionResolved = description ?? t((s) => s.workspace.siteDescription.default)
  const title = getHeadTitle(categoryResolved)
  return {
    meta: [
      { title },
      { name: 'description', content: descriptionResolved },
      { property: 'og:title', content: title },
      { property: 'og:description', content: descriptionResolved },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: descriptionResolved },
    ],
  }
}

/** Head for a CMS article: `getRouteHead` plus an `Article` */
export const getArticleHead = ({
  title,
  description,
  pathname,
  datePublished,
}: {
  title: string
  description?: string
  pathname: string
  datePublished?: string
}) => {
  const headTitle = getHeadTitle(title)
  const descriptionResolved = description ?? t((s) => s.workspace.siteDescription.default)
  return {
    meta: [
      { title: headTitle },
      { name: 'description', content: descriptionResolved },
      { property: 'og:title', content: headTitle },
      { property: 'og:description', content: descriptionResolved },
      { property: 'og:type', content: 'article' },
      { name: 'twitter:title', content: headTitle },
      { name: 'twitter:description', content: descriptionResolved },
      {
        'script:ld+json': {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          ...(description && { description }),
          ...(datePublished && { datePublished }),
          url: buildCanonicalUrl(pathname),
          publisher: ORGANIZATION_JSON_LD,
        },
      },
    ],
  }
}

/** Head for the places pages; `items` (the server-rendered list) becomes an `ItemList`. */
export const getPlacesHead = ({
  category,
  description,
  pathname,
  items = [],
}: {
  category: string
  description: string
  pathname: string
  items?: { name: string; pathname?: string }[]
}) => {
  const title = getHeadTitle(category)
  const canonical = buildCanonicalUrl(pathname)
  return {
    meta: [
      { title },
      // Not public yet outside platform mode
      ...(!PLATFORM_MODE ? [{ name: 'robots', content: 'noindex, nofollow' }] : []),
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: canonical },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      {
        'script:ld+json': {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: title,
          description,
          url: canonical,
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: items.length,
            itemListElement: items.map((item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: item.name,
              ...(item.pathname && { url: buildCanonicalUrl(item.pathname) }),
            })),
          },
        },
      },
    ],
  }
}

export type VesselHeadData =
  | {
      vesselId?: string
      vesselDatasetId?: string
      shipname?: string
      flag?: string
      ssvid?: string
      imo?: string
    }
  | undefined

export const getVesselHead = (data?: VesselHeadData) => {
  const canonical = buildCanonicalUrl(data?.vesselId ? `/vessel/${data.vesselId}` : undefined)

  if (!data?.shipname) {
    return getRouteHead({ category: t((s) => s.vessel.title) })
  }

  const vesselName = formatInfoField(data.shipname, 'shipname') as string
  const flagLabel = data.flag ? (formatInfoField(data.flag, 'flag') as string) : undefined
  const identifiers = [
    data.imo ? `IMO ${data.imo}` : undefined,
    data.ssvid ? `MMSI ${data.ssvid}` : undefined,
  ]
    .filter(Boolean)
    .join(', ')
  const titleDetails = [flagLabel, data.ssvid ? `MMSI ${data.ssvid}` : undefined].filter(Boolean)
  const title = `${PREFIX} | ${vesselName}${titleDetails.length ? ` (${titleDetails.join(', ')})` : ''}`
  const description = `Explore vessel identity, activity and events for ${vesselName}${
    flagLabel ? ` flagged to ${flagLabel}` : ''
  }${identifiers ? ` (${identifiers})` : ''} on the Global Fishing Watch map.`

  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: canonical },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      {
        'script:ld+json': {
          '@context': 'https://schema.org',
          '@type': 'Vehicle',
          name: vesselName,
          ...(flagLabel ? { countryOfOrigin: flagLabel } : {}),
          ...(data.imo ? { vehicleIdentificationNumber: String(data.imo) } : {}),
          ...(data.ssvid
            ? {
                identifier: {
                  '@type': 'PropertyValue',
                  propertyID: 'MMSI',
                  value: String(data.ssvid),
                },
              }
            : {}),
          url: canonical,
        },
      },
    ],
  }
}

export const getWorkspaceHead = (category: WorkspaceCategoryDescriptionKey) => {
  const description = t((s) => s.workspace.siteDescription[category]) || DEFAULT_DESCRIPTION
  return getRouteHead({ category, description })
}

export const getSearchHead = () => {
  return getRouteHead({
    category: t((s) => s.search.title),
    description: t((s) => s.workspace.siteDescription.search),
  })
}
