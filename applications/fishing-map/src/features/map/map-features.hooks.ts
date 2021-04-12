import { useEffect, useMemo, useRef, useState } from 'react'
import { atom, useRecoilState } from 'recoil'
import { TEMPORALGRID_SOURCE_LAYER, TimeChunks } from '@globalfishingwatch/layer-composer'
import { MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID } from '@globalfishingwatch/dataviews-client'
import { AnyGeneratorConfig } from '@globalfishingwatch/layer-composer/dist/generators/types'
import useMapInstance from 'features/map/map-context.hooks'
import { useGeneratorStyleMetadata, useMapStyle } from './map.hooks'

const sourcesLoadingState = atom<{ [key: string]: boolean }>({
  key: 'sourcesState',
  default: {},
})

let listenerAttached = false
export const useSourcesLoadingState = () => {
  const [sourcesState, setSourcesState] = useRecoilState(sourcesLoadingState)
  const map = useMapInstance()
  const idledAttached = useRef<boolean>(true)
  useEffect(() => {
    const detachListeners = () => {
      if (map) {
        map.off('sourcedataloading', sourceEventCallback)
        map.off('idle', sourceEventCallback)
        map.off('error', sourceEventCallback)
      }
    }

    if (!map || listenerAttached) return detachListeners

    const sourceEventCallback = (e: any) => {
      const currentSources = Object.keys(map.getStyle().sources || {})
      const sourcesLoaded = currentSources.map((sourceId) => [
        sourceId,
        map.isSourceLoaded(sourceId),
      ])
      const allSourcesLoaded = sourcesLoaded.every(([id, loaded]) => loaded)
      if (allSourcesLoaded) {
        map.off('idle', sourceEventCallback)
        idledAttached.current = false
      } else if (!idledAttached.current) {
        map.on('idle', sourceEventCallback)
        idledAttached.current = true
      }
      setSourcesState(Object.fromEntries(sourcesLoaded))
    }
    if (map && !listenerAttached) {
      map.on('sourcedataloading', sourceEventCallback)
      map.on('idle', sourceEventCallback)
      map.on('error', sourceEventCallback)

      // TODO: improve this workaroud to avoid attaching listeners on every hook instance
      listenerAttached = true
    }
    return detachListeners
  }, [map, setSourcesState])

  const serializedSourcesState = Object.entries(sourcesState)
    .map((s) => s.join('_'))
    .join('__')

  return useMemo(() => {
    return sourcesState
  }, [serializedSourcesState])
}

export const useSourceLoaded = (sourceId: string) => {
  const sourcesState = useSourcesLoadingState()
  return sourcesState[sourceId] === true
}

export const useHaveAllSourcesLoaded = (sourcesIds: string[]) => {
  console.log('useHaveAllSourcesLoaded')
  const sourcesState = useSourcesLoadingState()
  console.log(sourcesState)
  const haveAllSourcesLoaded = sourcesIds.every((sourceId) => sourcesState[sourceId] === true)
  return useMemo(() => {
    return haveAllSourcesLoaded
  }, [haveAllSourcesLoaded])
}

export const useActiveHeatmapAnimatedMetadatas = (generators: AnyGeneratorConfig[]) => {
  const style = useMapStyle()
  const generatorsIds = generators.map((generator) => generator.id)
  const generatorsMetadata = generatorsIds.map((generatorId) => {
    return style?.metadata?.generatorsMetadata[generatorId]
  })
  const serializedGeneratorIds = generatorsMetadata
    .map((metadata) => {
      return metadata?.timeChunks?.activeSourceId
    })
    .join()
  const metadatas = useMemo(() => {
    return generatorsMetadata
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializedGeneratorIds])
  return metadatas
}

export const useFeatures = ({
  generators,
  sourceLayer = 'main',
  filter,
}: {
  generators: AnyGeneratorConfig[]
  sourceLayer?: string
  filter?: any[]
}) => {
  const sourcesMetadata = useActiveHeatmapAnimatedMetadatas(generators)
  const activeSourcesIds = useMemo(() => {
    return sourcesMetadata.map((metadata) => metadata?.timeChunks?.activeSourceId)
  }, [sourcesMetadata])
  const haveAllSourcesLoaded = useHaveAllSourcesLoaded(activeSourcesIds)
  const map = useMapInstance()

  const sourcesFeatures = useMemo(() => {
    if (haveAllSourcesLoaded && map) {
      const features = sourcesMetadata.map((metadata) => {
        const sourceId = metadata?.timeChunks?.activeSourceId
        const sourceFeatures = map.querySourceFeatures(sourceId, {
          sourceLayer,
          ...(filter && { filter }),
        })
        return sourceFeatures
      })
      return features
    }
  }, [haveAllSourcesLoaded, map, sourcesMetadata, sourceLayer, filter])

  return { sourcesFeatures, sourcesMetadata, haveAllSourcesLoaded }
}

/**
TODO: DEPRECATE
 */
export const useMapSourceLoaded = (sourceId: string, cacheKey?: string) => {
  const map = useMapInstance()
  const [sourceLoaded, setSourceLoaded] = useState(false)

  // if cacheKey changed, reset loading status
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

    // if no cachekey specified and sourceLoaded already true, start listen to sourceloading events
    // and reset loading status to false when source starts loading again
    // TODO could we simplify that by checking map?.isSourceLoaded() every time the hook is run?
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

/**
TODO: DEPRECATE
 */
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
  // console.log(sourceId, sourceLayer, sourceLoaded, useMapStyle())

  const features = useMemo(() => {
    if (sourceLoaded) {
      const features = map?.querySourceFeatures(sourceId, {
        sourceLayer: sourceLayer,
        ...(filter && { filter }),
      })
      // console.log(features)
      return features
    }
  }, [sourceLoaded, map, sourceId, sourceLayer, filter])

  return { features, sourceLoaded }
}

/**
TODO: DEPRECATE
 */
const useMapTemporalgridLayerFeatures = ({
  cacheKey,
  generatorId,
}: {
  cacheKey?: string
  generatorId: string
}) => {
  const mergedActivityGenMetadata = useGeneratorStyleMetadata(generatorId)
  const currentTimeChunks = mergedActivityGenMetadata.timeChunks as TimeChunks
  const currentTimeChunkId = currentTimeChunks?.activeSourceId

  return useMapFeatures({
    sourceId: currentTimeChunkId,
    sourceLayer: TEMPORALGRID_SOURCE_LAYER,
    cacheKey,
  })
}

/**
TODO: DEPRECATE
 */
export const useActivityTemporalgridFeatures = ({ cacheKey }: { cacheKey?: string } = {}) => {
  return useMapTemporalgridLayerFeatures({
    cacheKey,
    generatorId: MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID,
  })
}
