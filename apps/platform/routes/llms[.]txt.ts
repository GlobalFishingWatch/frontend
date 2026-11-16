import { createFileRoute } from '@tanstack/react-router'

import { ROUTE_PATHS } from '@platform/config/routes'

import { PLATFORM_MODE } from 'data/map/config'
import { PLACE_TYPES } from 'features/_places/places.types'
import { buildCanonicalUrl } from 'router/router.meta'

const link = (name: string, path: string, description: string) =>
  `- [${name}](${buildCanonicalUrl(path)}): ${description}`

/** https://llmstxt.org — a plain-text map of the app for AI engines */
const LLMS_TXT = [
  '# Global Fishing Watch Map',
  '',
  '> Free, open platform to view and analyse global fishing and vessel activity, built from AIS, VMS and satellite detections.',
  '',
  '## Explore',
  link('Map', ROUTE_PATHS.MAP, 'Interactive map of fishing effort, vessel presence and events'),
  link('Vessel search', ROUTE_PATHS.SEARCH, 'Find vessels by name, MMSI, IMO or call sign'),
  ...(PLATFORM_MODE
    ? [
        '',
        '## Places',
        link('Ports', ROUTE_PATHS.PORTS, 'Ports ranked by vessel activity'),
        ...PLACE_TYPES.areas.map((type) =>
          link(
            `Areas: ${type.toUpperCase()}`,
            `${ROUTE_PATHS.AREAS}/${type}`,
            'Marine areas ranked by activity'
          )
        ),
      ]
    : []),
  '',
  '## Help and resources',
  link('Help and resources', ROUTE_PATHS.HELP_HUB, 'Guides, tutorials and dataset documentation'),
  '',
  '## Optional',
  link('Sitemap', '/sitemap.xml', 'Every indexable vessel and place page'),
  '',
].join('\n')

export const Route = createFileRoute('/llms.txt')({
  server: {
    handlers: {
      GET: () =>
        new Response(LLMS_TXT, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=86400',
          },
        }),
    },
  },
})
