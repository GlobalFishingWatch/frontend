import { createFileRoute, redirect } from '@tanstack/react-router'
import { startCase } from 'es-toolkit'

import { ROUTE_PATHS } from '@platform/config/routes'

import { getHelpHubSectionCopy } from 'features/help/helpHub.i18n'
import {
  getHelpHubArticleContent,
  type HelpHubArticleData,
  helpHubRouteCache,
} from 'features/help/helpHub.loaders'
import { findHelpHubSection } from 'features/help/helpHub.utils'
import HelpHubSectionPage from 'features/help/HelpHubSectionPage'
import { buildCanonicalUrl, getRouteHead } from 'router/router.meta'

/**
 * One route serves both `/help-and-resources/$sectionSlug` and `.../$itemSlug`. The loader fetches
 * a single article plus a bodyless index of the section, which feeds the menu and the prev/next
 * links; the section root shows the first article.
 */
export const Route = createFileRoute(
  '/_platform/_content/help-and-resources/$sectionSlug/{-$itemSlug}'
)({
  component: HelpHubSectionPage,
  ...helpHubRouteCache,
  beforeLoad: ({ params }) => {
    if (!findHelpHubSection(params.sectionSlug)) {
      throw redirect({
        to: ROUTE_PATHS.HELP_HUB,
        replace: true,
        statusCode: 308,
      })
    }
  },
  loader: async ({ params, deps }): Promise<HelpHubArticleData> => {
    const section = findHelpHubSection(params.sectionSlug)
    if (!section) return { index: [] }
    return getHelpHubArticleContent({
      data: { sectionId: section.id, locale: deps.locale, itemSlug: params.itemSlug },
    })
  },
  head: ({ params, loaderData }) => {
    const section = findHelpHubSection(params.sectionSlug)
    if (!section) {
      return getRouteHead()
    }
    const { title, description } = getHelpHubSectionCopy(section.id)
    const item = loaderData?.item
    return {
      ...getRouteHead({
        category: params.itemSlug ? (item?.title ?? startCase(params.itemSlug)) : title,
        description: item?.description ?? description,
      }),
      links: [
        {
          rel: 'canonical',
          href: buildCanonicalUrl(
            `/help-and-resources/${section.slug}${params.itemSlug ? `/${params.itemSlug}` : ''}`
          ),
        },
      ],
    }
  },
})
