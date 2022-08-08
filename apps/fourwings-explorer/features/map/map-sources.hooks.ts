import { useEffect } from 'react'
import { atom, useRecoilValue, useSetRecoilState } from 'recoil'
import { MapDataEvent } from '@globalfishingwatch/maplibre-gl'
import { ExtendedStyle } from '@globalfishingwatch/layer-composer'
import { isMergedAnimatedGenerator } from '@globalfishingwatch/dataviews-client'
import { useMemoCompare } from '@globalfishingwatch/react-hooks'
import useMapInstance, { useMapInstanceStyle } from 'features/map/map-context.hooks'

export type TilesAtomSourceState = {
  loaded: boolean
  error?: string
}
export const mapTilesAtom = atom<Record<string, TilesAtomSourceState>>({
  key: 'mapSourceTilesState',
  default: {},
})

type SourcesHookInput = string | string[]
// TODO: move this to fork and include sourceId in the event for tiles loaded
type CustomMapDataEvent = MapDataEvent & { sourceId: string; error?: string }

export const getHeatmapSourceMetadata = (style: ExtendedStyle, id: string) => {
  return style?.metadata?.generatorsMetadata?.[id]
}

const toArray = (elem) => (Array.isArray(elem) ? elem : [elem])

const getSourcesFromMergedGenerator = (style: ExtendedStyle, mergeId: string) => {
  const meta = getHeatmapSourceMetadata(style, mergeId)
  return meta?.timeChunks.activeSourceId
}

const getGeneratorSourcesIds = (style: ExtendedStyle, sourcesIds: SourcesHookInput) => {
  const sourcesIdsList = toArray(sourcesIds)
  const sources = sourcesIdsList.flatMap((source) => {
    if (isMergedAnimatedGenerator(source)) {
      return getSourcesFromMergedGenerator(style, source)
    }
    return source
  })
  return sources
}

export const useSourceInStyle = (sourcesIds: SourcesHookInput) => {
  const style = useMapInstanceStyle()
  if (!sourcesIds || !sourcesIds.length) {
    return false
  }
  const sourcesIdsList = getGeneratorSourcesIds(style, sourcesIds)
  const sourcesLoaded = sourcesIdsList.every((source) => style?.sources?.[source] !== undefined)
  return sourcesLoaded
}

export const useMapSourceTilesLoadedAtom = () => {
  // Used it once in Map.tsx the listeners only once
  const map = useMapInstance()
  const setSourceTilesLoaded = useSetRecoilState(mapTilesAtom)

  useEffect(() => {
    if (!map) return

    const onSourceDataLoading = (e: CustomMapDataEvent) => {
      const { sourceId } = e
      if (sourceId) {
        setSourceTilesLoaded((state) => {
          const source = { ...state[sourceId], loaded: false }
          return {
            ...state,
            [sourceId]: source,
          }
        })
      }
    }

    const onSourceTilesLoaded = (e: CustomMapDataEvent) => {
      const { sourceId, error: tileError } = e
      if (sourceId) {
        setSourceTilesLoaded((state) => {
          let error = state[sourceId]?.error
          if (error === undefined && tileError !== undefined) {
            error = tileError || 'Unknown error'
          }
          return {
            ...state,
            [sourceId]: { loaded: true, ...(error && { error }) },
          }
        })
      }
    }
    if (map) {
      map.on('dataloading', onSourceDataLoading)
      map.on('sourcetilesdata', onSourceTilesLoaded)
    }
    const detachListeners = () => {
      map.off('dataloading', onSourceDataLoading)
      map.off('sourcetilesdata', onSourceTilesLoaded)
    }

    return detachListeners
  }, [map, setSourceTilesLoaded])
}

export const useMapSourceTiles = (sourcesId?: SourcesHookInput) => {
  const sourceTilesLoaded = useRecoilValue(mapTilesAtom)
  const sourcesIdsList = toArray(sourcesId)
  const sourcesLoaded = sourcesId
    ? Object.fromEntries(
        Object.entries(sourceTilesLoaded).filter(([id, source]) => {
          return sourcesIdsList.includes(id)
        })
      )
    : sourceTilesLoaded
  return useMemoCompare(sourcesLoaded)
}

export const useMapSourceTilesLoaded = (sourcesId: SourcesHookInput) => {
  const style = useMapInstanceStyle()
  const sourceTilesLoaded = useMapSourceTiles()
  const sourceInStyle = useSourceInStyle(sourcesId)
  const sourcesIdsList = getGeneratorSourcesIds(style, sourcesId)
  const allSourcesLoaded = sourcesIdsList.map((source) => sourceTilesLoaded[source]?.loaded)
  return sourceInStyle && allSourcesLoaded.every((loaded) => loaded)
}

export const useMapClusterTilesLoaded = () => {
  const sourceTilesLoaded = useMapSourceTiles()
  return Object.entries(sourceTilesLoaded).every(([source, state]) => state?.loaded)
}

export const useAllMapSourceTilesLoaded = () => {
  const style = useMapInstanceStyle()
  const sources = Object.keys(style?.sources || {})
  const sourceTilesLoaded = useMapSourceTiles()
  const allSourcesLoaded = sources.every((source) => sourceTilesLoaded[source]?.loaded === true)
  return allSourcesLoaded
}
