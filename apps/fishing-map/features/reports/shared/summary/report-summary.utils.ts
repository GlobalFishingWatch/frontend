import { uniqBy } from 'es-toolkit'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import { getSourcesSelectedInDataview } from 'features/workspace/activity/activity.utils'

export const getReportSourcesWithVessels = (
  dataviews: UrlDataviewInstance[],
  datasetIdsWithVessels?: string[] | null
): string[] => {
  return uniqBy(
    dataviews.flatMap((dataview) => getSourcesSelectedInDataview(dataview)),
    (source) => source.id
  )
    .filter((source) => !datasetIdsWithVessels || datasetIdsWithVessels.includes(source.id))
    .map((source) => source.label)
}
