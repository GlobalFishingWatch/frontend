import type { AppState } from 'types'

import { strapiApi } from './loaders'
import type { TDataset, TStrapiResponse, TUserGuideSection } from './strapi.types'

type SidePanelContent = NonNullable<AppState['sidePanelContent']>

type StrapiResult = TStrapiResponse<TUserGuideSection> | TStrapiResponse<TDataset>

const sidePanelFetcherMap: Record<
  SidePanelContent,
  (sidePanelId?: string, locale?: string) => Promise<StrapiResult>
> = {
  userGuide: (_, locale) => strapiApi.userGuide.getAll({ data: { locale } }),
  datasets: (sidePanelId, locale) =>
    strapiApi.datasets.getById({ data: { datasetId: sidePanelId!, locale } }),
}

export function fetchSidePanelContent(
  sidePanelContent: SidePanelContent | undefined,
  sidePanelId?: string,
  locale?: string
) {
  if (!sidePanelContent) return null
  return sidePanelFetcherMap[sidePanelContent](sidePanelId, locale)
}
