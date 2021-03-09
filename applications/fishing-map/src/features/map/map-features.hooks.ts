import { useEffect, useMemo, useState } from 'react'
import { useMapboxInstance } from './map.context'
import { useCurrentTimeChunkId } from './map.hooks'

export const useMapSourceLoaded = (sourceId: string, cacheKey?: string) => {
  const mapInstance = useMapboxInstance()
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
      if (mapInstance && sourceLoaded) {
        mapInstance.on('sourcedataloading', sourceLoadingCallback)
      }
    }

    return () => {
      if (mapInstance) {
        mapInstance.off('sourcedataloading', sourceLoadingCallback)
      }
    }
  }, [cacheKey, mapInstance, sourceId, sourceLoaded])

  useEffect(() => {
    const sourceCallback = () => {
      if (mapInstance?.getSource(sourceId) && mapInstance?.isSourceLoaded(sourceId)) {
        setSourceLoaded(true)
        mapInstance.off('idle', sourceCallback)
      }
    }

    const sourceErrorCallback = (errorEvent: any) => {
      if (
        errorEvent.sourceId === sourceId &&
        mapInstance?.getSource(sourceId) &&
        mapInstance?.isSourceLoaded(sourceId)
      ) {
        setSourceLoaded(true)
      }
    }

    if (mapInstance && sourceId && !sourceLoaded) {
      mapInstance.on('idle', sourceCallback)
      mapInstance.on('error', sourceErrorCallback)
    }

    return () => {
      if (mapInstance) {
        mapInstance.off('idle', sourceCallback)
        mapInstance.off('error', sourceErrorCallback)
      }
    }
  }, [mapInstance, sourceId, sourceLoaded])

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
  const mapInstance = useMapboxInstance()
  const sourceLoaded = useMapSourceLoaded(sourceId, cacheKey)

  const features = useMemo(() => {
    if (sourceLoaded) {
      const features = mapInstance?.querySourceFeatures(sourceId, {
        sourceLayer: sourceLayer,
        ...(filter && { filter }),
      })
      return features
    }
  }, [sourceLoaded, mapInstance, sourceId, sourceLayer, filter])

  return { features, sourceLoaded }
}

export const useMapTemporalgridFeatures = ({ cacheKey }: { cacheKey?: string } = {}) => {
  const currentTimeChunkId = useCurrentTimeChunkId()

  return useMapFeatures({
    sourceId: currentTimeChunkId,
    sourceLayer: 'temporalgrid_interactive',
    cacheKey,
  })
}
