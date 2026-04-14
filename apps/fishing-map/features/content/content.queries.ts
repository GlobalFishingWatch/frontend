import { queryOptions, skipToken } from '@tanstack/react-query'

import type { AppState } from 'types'

import { strapiApi } from './loaders'
import type { TDataset, TStrapiResponse, TUserGuideSection } from './strapi.types'

type SidePanelContent = NonNullable<AppState['sidePanelContent']>

type StrapiResult =
  //   | TStrapiResponseCollection<TUserGuideSection>
  | TStrapiResponse<TUserGuideSection>
  //   | TStrapiResponseCollection<TDataset>
  | TStrapiResponse<TDataset>

const sidePanelFetcherMap: Record<
  SidePanelContent,
  (sidePanelId?: string) => Promise<StrapiResult>
> = {
  userGuide: (sidePanelId) =>
    sidePanelId ? strapiApi.userGuide.getById({ data: sidePanelId }) : strapiApi.userGuide.getAll(),
  datasets: (sidePanelId) => strapiApi.datasets.getById({ data: sidePanelId! }),
}

/** Use directly in route loaders — no QueryClient context required */
export function fetchSidePanelContent(
  sidePanelContent: SidePanelContent | undefined,
  sidePanelId?: string
) {
  if (!sidePanelContent) return null
  return sidePanelFetcherMap[sidePanelContent](sidePanelId)
}

// /** Use with useQuery in components */
// export function sidePanelContentQueryOptions(sidePanelContent: SidePanelContent | undefined) {
//   return queryOptions({
//     queryKey: ['sidePanelContent', sidePanelContent] as const,
//     queryFn: sidePanelContent ? sidePanelFetcherMap[sidePanelContent] : skipToken,
//   })
// }
