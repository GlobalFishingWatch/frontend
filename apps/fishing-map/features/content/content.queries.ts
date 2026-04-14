import type { AppState } from 'types'

import { strapiApi } from './loaders'
import type { TDataset, TStrapiResponse, TUserGuideSection } from './strapi.types'

type SidePanelContent = NonNullable<AppState['sidePanelContent']>

type StrapiResult = TStrapiResponse<TUserGuideSection> | TStrapiResponse<TDataset>

const sidePanelFetcherMap: Record<
  SidePanelContent,
  (sidePanelId?: string) => Promise<StrapiResult>
> = {
  userGuide: () => strapiApi.userGuide.getAll(),
  datasets: (sidePanelId) => strapiApi.datasets.getById({ data: sidePanelId! }),
}

export function fetchSidePanelContent(
  sidePanelContent: SidePanelContent | undefined,
  sidePanelId?: string
) {
  if (!sidePanelContent) return null
  return sidePanelFetcherMap[sidePanelContent](sidePanelId)
}
