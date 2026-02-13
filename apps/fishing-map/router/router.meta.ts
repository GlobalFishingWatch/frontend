import { t } from 'features/i18n/i18n'
import type Resources from 'features/i18n/i18n.types'

export type WorkspaceCategoryDescriptionKey =
  keyof Resources['translations']['workspace']['siteDescription']

const PREFIX = 'GFW'
const DEFAULT_DESCRIPTION = `Through our free and open data transparency platform, Global Fishing Watch enables research and innovation in support of ocean sustainability.`

const getHeadTitle = (category = t((tr) => tr.common.map) as string) => `${PREFIX} | ${category}`

export const getRouteHead = (
  {
    category = t((tr) => tr.common.map),
    description = t((t) => t.workspace.siteDescription.default, {
      defaultValue: DEFAULT_DESCRIPTION,
    }) as string,
  } = {} as { category?: string; description?: string }
) => ({
  meta: [
    {
      title: getHeadTitle(category),
      description,
    },
  ],
})

export const getWorkspaceHead = (category: WorkspaceCategoryDescriptionKey) => {
  return getRouteHead({
    category,
    description: t((t) => t.workspace.siteDescription[category], {
      defaultValue: 'workspaces description',
    }),
  })
}

export const getSearchHead = () => {
  return getRouteHead({
    category: t((tr) => tr.search.title),
    description: t((t) => t.workspace.siteDescription.search, {
      defaultValue: 'search description',
    }),
  })
}
