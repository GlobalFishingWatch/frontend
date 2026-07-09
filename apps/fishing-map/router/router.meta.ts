import { PATH_BASENAME } from 'data/config'
import { t } from 'features/i18n/i18n'
import type Resources from 'features/i18n/i18n.types'
import { formatInfoField } from 'utils/info'

export type WorkspaceCategoryDescriptionKey =
  keyof Resources['translations']['workspace']['siteDescription']

const PREFIX = 'GFW'
const SITE_ORIGIN = 'https://globalfishingwatch.org'
const DEFAULT_DESCRIPTION = `Through our free and open data transparency platform, Global Fishing Watch enables research and innovation in support of ocean sustainability.`

const buildCanonicalUrl = (pathname?: string) => {
  if (!pathname) return `${SITE_ORIGIN}${PATH_BASENAME}`
  const withBase = pathname.startsWith(PATH_BASENAME) ? pathname : `${PATH_BASENAME}${pathname}`
  return `${SITE_ORIGIN}${withBase}`
}

export const getDefaultMeta = (
  title: string,
  description: string
): { meta: Record<string, string>[]; links: Record<string, string>[] } => ({
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
  return {
    meta: [
      { title: getHeadTitle(categoryResolved) },
      { name: 'description', content: descriptionResolved },
    ],
  }
}

export type VesselHeadData =
  | {
      canonicalPath?: string
      shipname?: string
      flag?: string
      ssvid?: string
      imo?: string
    }
  | undefined

export const getVesselHead = (data?: VesselHeadData) => {
  const canonical = buildCanonicalUrl(data?.canonicalPath)
  const links = [{ rel: 'canonical', href: canonical }]

  if (!data?.shipname) {
    return {
      ...getRouteHead({ category: t((s) => s.vessel.title) }),
      links,
    }
  }

  const vesselName = formatInfoField(data.shipname, 'shipname') as string
  const flagLabel = data.flag ? (formatInfoField(data.flag, 'flag') as string) : undefined
  const identifiers = [
    data.imo ? `IMO ${data.imo}` : undefined,
    data.ssvid ? `MMSI ${data.ssvid}` : undefined,
  ]
    .filter(Boolean)
    .join(', ')
  const title = `${PREFIX} | ${vesselName}${flagLabel ? ` (${flagLabel})` : ''}`
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
          url: canonical,
        },
      },
    ],
    links,
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
