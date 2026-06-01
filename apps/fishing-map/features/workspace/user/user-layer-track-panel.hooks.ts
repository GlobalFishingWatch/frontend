import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { NO_RECORD_ID } from '@globalfishingwatch/data-transforms'
import {
  getDatasetConfigurationProperty,
  getUserDataviewDataset,
} from '@globalfishingwatch/datasets-client'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { useGetDeckLayer } from '@globalfishingwatch/deck-layer-composer'
import { type AnyUserLayer, UserTracksLayer } from '@globalfishingwatch/deck-layers'

import { selectActiveUserTrackDataviews } from 'features/dataviews/selectors/dataviews.instances.selectors'

export function useUserLayerMetadata(dataview: UrlDataviewInstance, mergedDataviewId?: string) {
  const dataset = getUserDataviewDataset(dataview)
  const allTracksActive = useSelector(selectActiveUserTrackDataviews)
  const userLayer = useGetDeckLayer<AnyUserLayer>(mergedDataviewId || dataview?.id)

  const data = useMemo(() => {
    if (userLayer?.instance instanceof UserTracksLayer) {
      return userLayer?.instance?.getData?.()
    }
  }, [userLayer])

  const idProperty = getDatasetConfigurationProperty({
    dataset,
    property: 'lineId',
  }) as string

  const hasRecordIds = idProperty
    ? data?.features?.some((f) => !f.properties?.id?.startsWith?.(NO_RECORD_ID))
    : false

  const singleTrack = allTracksActive.length === 1
  const hasFeaturesColoredByField = singleTrack && data && hasRecordIds

  return {
    data,
    hasRecordIds,
    hasFeaturesColoredByField,
    error: userLayer?.instance?.getError?.(),
    loaded: userLayer?.loaded,
    instance: userLayer?.instance,
  }
}
