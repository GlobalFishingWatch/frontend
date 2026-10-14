import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { DataviewType } from '@globalfishingwatch/api-types'
import { resolveDataviews, type UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { BasemapType } from '@globalfishingwatch/deck-layers'
import { BASEMAP_LABELS_DATAVIEW_SLUG } from '@platform/config/map/dataviews'

import { selectAllDatasets } from 'features/_map/datasets/datasets.slice'
import { selectAllDataviews } from 'features/_map/dataviews/dataviews.slice'
import type { Locale } from 'types'

/** Dataviews and datasets are preloaded into the store by the route loader (`loadPlaces`). */
export function usePlacesMapDataviewsResolved({
  dataviewInstances,
  basemap,
}: {
  dataviewInstances?: UrlDataviewInstance[]
  basemap: BasemapType
}) {
  const { i18n } = useTranslation()
  const dataviews = useSelector(selectAllDataviews)
  const datasets = useSelector(selectAllDatasets)

  return useMemo(() => {
    if (!dataviewInstances?.length || !dataviews.length || !datasets.length) return []
    return resolveDataviews(dataviewInstances, dataviews, datasets, []).map((dataview) => {
      if (dataview.dataviewId === BASEMAP_LABELS_DATAVIEW_SLUG) {
        return { ...dataview, config: { ...dataview.config, locale: i18n.language as Locale } }
      }
      if (dataview.config?.type === DataviewType.Basemap) {
        return { ...dataview, config: { ...dataview.config, basemap } }
      }
      return dataview
    })
  }, [dataviewInstances, basemap, dataviews, datasets, i18n.language])
}
