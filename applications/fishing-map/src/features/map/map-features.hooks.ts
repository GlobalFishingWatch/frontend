import { useEffect, useMemo, useState } from 'react'
import { TEMPORALGRID_SOURCE_LAYER, TimeChunks } from '@globalfishingwatch/layer-composer'
import { MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID } from '@globalfishingwatch/dataviews-client'
import useMapInstance from 'features/map/map-context.hooks'
import { useGeneratorStyleMetadata } from './map.hooks'

export const useMapSourceLoaded = (sourceId: string, cacheKey?: string) => {
  const map = useMapInstance()
  const [sourceLoaded, setSourceLoaded] = useState(false)

  useEffect(() => {
    if (cacheKey) {
      setSourceLoaded(false)
    }
  }, [cacheKey])

  useEffect(() => {
    const sourceLoadingCallback = (sourcedataEvent: any) => {
      if (sourcedataEvent.sourceId === sourceId) {
        setSourceLoaded(false)
      }
    }

    if (!cacheKey) {
      if (map && sourceLoaded) {
        map.on('sourcedataloading', sourceLoadingCallback)
      }
    }

    return () => {
      if (map) {
        map.off('sourcedataloading', sourceLoadingCallback)
      }
    }
  }, [cacheKey, map, sourceId, sourceLoaded])

  useEffect(() => {
    const sourceCallback = () => {
      if (map?.getSource(sourceId) && map?.isSourceLoaded(sourceId)) {
        setSourceLoaded(true)
        map.off('idle', sourceCallback)
      }
    }

    const sourceErrorCallback = (errorEvent: any) => {
      if (
        errorEvent.sourceId === sourceId &&
        map?.getSource(sourceId) &&
        map?.isSourceLoaded(sourceId)
      ) {
        setSourceLoaded(true)
      }
    }

    if (map && sourceId && !sourceLoaded) {
      map.on('idle', sourceCallback)
      map.on('error', sourceErrorCallback)
    }

    return () => {
      if (map) {
        map.off('idle', sourceCallback)
        map.off('error', sourceErrorCallback)
      }
    }
  }, [map, sourceId, sourceLoaded])

  return sourceLoaded
}

export const useMapFeatures = ({
  sourceId,
  sourceLayer = 'main',
  cacheKey,
  filter,
}: {
  sourceId: string
  sourceLayer?: string
  cacheKey?: string
  filter?: any[]
}) => {
  const map = useMapInstance()
  const sourceLoaded = useMapSourceLoaded(sourceId, cacheKey)

  const features = useMemo(() => {
    if (sourceLoaded) {
      const features = map?.querySourceFeatures(sourceId, {
        sourceLayer: sourceLayer,
        ...(filter && { filter }),
      })
      return features
    }
  }, [sourceLoaded, map, sourceId, sourceLayer, filter])

  return { features, sourceLoaded }
}

export const useMapTemporalgridFeatures = ({ cacheKey }: { cacheKey?: string } = {}) => {
  const mergedActivityGenMetadata = useGeneratorStyleMetadata(
    MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID
  )
  const currentTimeChunks = mergedActivityGenMetadata.timeChunks as TimeChunks
  const currentTimeChunkId = currentTimeChunks?.activeSourceId

  return useMapFeatures({
    sourceId: currentTimeChunkId,
    sourceLayer: TEMPORALGRID_SOURCE_LAYER,
    cacheKey,
  })
}
