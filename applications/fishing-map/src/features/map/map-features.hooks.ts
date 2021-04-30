import { useEffect, useMemo, useRef } from 'react'
import { atom, useRecoilState } from 'recoil'
import { useSelector } from 'react-redux'
import { TEMPORALGRID_SOURCE_LAYER } from '@globalfishingwatch/layer-composer'
import { MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID } from '@globalfishingwatch/dataviews-client'
import { AnyGeneratorConfig } from '@globalfishingwatch/layer-composer/dist/generators/types'
import useMapInstance from 'features/map/map-context.hooks'
import { useMapStyle } from './map.hooks'
import {
  selectActiveHeatmapAnimatedGeneratorConfigs,
  selectGeneratorConfigsById,
} from './map.selectors'

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
    if (!map || listenerAttached) return
    const sourceEventCallback = (e: any) => {
      const currentSources = Object.keys(map.getStyle().sources || {})
      const sourcesLoaded = currentSources.map((sourceId) => [
        sourceId,
        map.isSourceLoaded(sourceId),
      ])
      const allSourcesLoaded = sourcesLoaded.every(([id, loaded]) => loaded)
      if (allSourcesLoaded && e.type === 'idle') {
        map.off('idle', sourceEventCallback)
        idledAttached.current = false
      } else if (!idledAttached.current) {
        map.on('idle', sourceEventCallback)
        idledAttached.current = true
      }
      setSourcesState(Object.fromEntries(sourcesLoaded))
    }
    if (map && !listenerAttached) {
      map.on('sourcedata', sourceEventCallback)
      map.on('sourcedataloading', sourceEventCallback)
      map.on('idle', sourceEventCallback)
      map.on('error', sourceEventCallback)

      // TODO: improve this workaroud to avoid attaching listeners on every hook instance
      listenerAttached = true
    }
    const detachListeners = () => {
      map.on('sourcedata', sourceEventCallback)
      map.off('sourcedataloading', sourceEventCallback)
      map.off('idle', sourceEventCallback)
      map.off('error', sourceEventCallback)
    }

    return detachListeners
  }, [map, setSourcesState])

  const serializedSourcesState = Object.entries(sourcesState)
    .map((s) => s.join('_'))
    .join('__')

  return useMemo(() => {
    return sourcesState
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializedSourcesState])
}

export const useSourceLoaded = (sourceId: string) => {
  const sourcesState = useSourcesLoadingState()
  return sourcesState[sourceId] === true
}

export const useHaveSourcesLoaded = (sourcesIds: string[]) => {
  const sourcesState = useSourcesLoadingState()
  const haveAllSourcesLoaded = sourcesIds.every((sourceId) => sourcesState[sourceId] === true)
  return useMemo(() => {
    return haveAllSourcesLoaded
  }, [haveAllSourcesLoaded])
}

export const useHasSourceLoaded = (sourceId: string) => {
  const sourcesState = useSourcesLoadingState()
  const haveAllSourcesLoaded = sourcesState[sourceId] === true
  return useMemo(() => {
    return haveAllSourcesLoaded
  }, [haveAllSourcesLoaded])
}

export const useActiveHeatmapAnimatedMetadatas = (generators: AnyGeneratorConfig[]) => {
  const style = useMapStyle()

  const generatorsIds = generators?.map((generator) => generator.id)
  const generatorsMetadata = generatorsIds?.flatMap((generatorId) => {
    return style?.metadata?.generatorsMetadata?.[generatorId] || []
  })

  const serializedGeneratorIds =
    generatorsMetadata &&
    generatorsMetadata
      .map((metadata) => {
        return metadata?.timeChunks?.activeSourceId + metadata?.numSublayers
      })
      .join()

  const metadatas = useMemo(() => {
    return generatorsMetadata || []
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializedGeneratorIds])
  return metadatas
}

export const useFeatures = ({
  sourcesIds,
  sourceLayer = 'main',
  filter,
}: {
  sourcesIds: string[]
  sourceLayer?: string
  filter?: any[]
}) => {
  const haveSourcesLoaded = useHaveSourcesLoaded(sourcesIds)
  const map = useMapInstance()

  const sourcesFeatures = useMemo(() => {
    if (haveSourcesLoaded && map) {
      const features = sourcesIds.map((sourceId) => {
        const sourceFeatures = map.querySourceFeatures(sourceId, {
          sourceLayer,
          ...(filter && { filter }),
        })
        return sourceFeatures
      })
      return features
    }
  }, [haveSourcesLoaded, map, sourceLayer, filter, sourcesIds])

  return { sourcesFeatures, haveSourcesLoaded }
}

const useGeneratorAnimatedFeatures = (generators: AnyGeneratorConfig[]) => {
  const sourcesMetadata = useActiveHeatmapAnimatedMetadatas(generators)

  const sourcesIds: string[] = useMemo(() => {
    return sourcesMetadata?.map((metadata) => metadata?.timeChunks?.activeSourceId)
  }, [sourcesMetadata])

  const { sourcesFeatures, haveSourcesLoaded } = useFeatures({
    sourcesIds,
    sourceLayer: TEMPORALGRID_SOURCE_LAYER,
  })
  return { sourcesFeatures, haveSourcesLoaded, sourcesMetadata }
}

export const useActiveHeatmapAnimatedFeatures = () => {
  const generators = useSelector(selectActiveHeatmapAnimatedGeneratorConfigs)
  return useGeneratorAnimatedFeatures(generators)
}

export const useActivityTemporalgridFeatures = () => {
  const generator = useSelector(
    selectGeneratorConfigsById(MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID)
  )
  return useGeneratorAnimatedFeatures(generator)
}
