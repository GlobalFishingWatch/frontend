import { createFileRoute, redirect } from '@tanstack/react-router'
import { startCase } from 'es-toolkit'

import { ROUTE_PATHS } from '@platform/config/routes'

import { findHelpHubSection } from 'features/help/helpHub.content'
import { getHelpHubSectionCopy } from 'features/help/helpHub.i18n'
import {
  getHelpHubLocale,
  type HelpHubSectionData,
  loadHelpHubSection,
} from 'features/help/helpHub.loaders'
import HelpHubSectionPage from 'features/help/HelpHubSectionPage'
import { buildCanonicalUrl, getRouteHead } from 'router/router.meta'

/**
 * One route serves both `/help-and-resources/$sectionSlug` and `.../$itemSlug`. The optional param
 * keeps it a single match, so scroll-driven URL changes swap params on a mounted component instead
 * of remounting it and throwing away the reader's scroll position.
 */
export const Route = createFileRoute(
  '/_platform/_content/help-and-resources/$sectionSlug/{-$itemSlug}'
)({
  component: HelpHubSectionPage,
  beforeLoad: ({ params }) => {
    if (!findHelpHubSection(params.sectionSlug)) {
      throw redirect({
        to: ROUTE_PATHS.HELP_HUB,
        replace: true,
        statusCode: 308,
      })
    }
  },
  loader: async ({ params }): Promise<HelpHubSectionData> => {
    const section = findHelpHubSection(params.sectionSlug)
    if (!section) return { items: [] }
    return loadHelpHubSection(section.id, getHelpHubLocale())
  },
  head: ({ params, loaderData }) => {
    const section = findHelpHubSection(params.sectionSlug)
    if (!section) {
      return getRouteHead()
    }
    const { title, description } = getHelpHubSectionCopy(section.id)
    const item = params.itemSlug
      ? loaderData?.items.find(({ slug }) => slug === params.itemSlug)
      : undefined
    return {
      ...getRouteHead({
        category: params.itemSlug ? (item?.title ?? startCase(params.itemSlug)) : title,
        description: item?.description ?? description,
      }),
      links: [
        {
          rel: 'canonical',
          href: buildCanonicalUrl(`/help-and-resources/${section.slug}`),
        },
      ],
    }
  },
})
