import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { uniq } from 'es-toolkit'

import type { Dataview } from '@globalfishingwatch/api-types'
import { resolveDataviews } from '@globalfishingwatch/dataviews-client'
import type { OceanAreaType } from '@globalfishingwatch/ocean-areas'
import { BASEMAP_LABELS_DATAVIEW_SLUG } from '@platform/config/map/dataviews'

import { fetchDatasetsByIdsThunk, selectAllDatasets } from 'features/_map/datasets/datasets.slice'
import { getDatasetsInDataviews } from 'features/_map/datasets/datasets.utils'
import {
  fetchDataviewsByIdsThunk,
  selectAllDataviews,
} from 'features/_map/dataviews/dataviews.slice'
import type { PlacesMapDataviews } from 'features/_places/places-map.config'
import { useAppDispatch } from 'features/app/app.hooks'
import type { Locale } from 'types'

export function usePlacesMapDataviews(dataviewsByType: PlacesMapDataviews, type: OceanAreaType) {
  const dispatch = useAppDispatch()
  const { i18n } = useTranslation()
  const dataviews = useSelector(selectAllDataviews)
  const datasets = useSelector(selectAllDatasets)

  useEffect(() => {
    const fetchMapDataviews = async () => {
      const dataviewIds = uniq(
        Object.values(dataviewsByType).flatMap((instances) =>
          instances.flatMap((instance) => instance.dataviewId ?? [])
        )
      )
      const { payload } = await dispatch(fetchDataviewsByIdsThunk(dataviewIds))
      if (payload) {
        const datasetsIds = getDatasetsInDataviews(payload as Dataview[])
        if (datasetsIds?.length) {
          dispatch(fetchDatasetsByIdsThunk({ ids: datasetsIds }))
        }
      }
    }
    fetchMapDataviews()
  }, [dispatch, dataviewsByType])

  return useMemo(() => {
    const instances = dataviewsByType[type]
    if (!instances?.length || !dataviews.length || !datasets.length) return []
    return resolveDataviews(instances, dataviews, datasets, []).map((dataview) =>
      dataview.dataviewId === BASEMAP_LABELS_DATAVIEW_SLUG
        ? { ...dataview, config: { ...dataview.config, locale: i18n.language as Locale } }
        : dataview
    )
  }, [dataviewsByType, type, dataviews, datasets, i18n.language])
}
