import { useEffect } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import useMapInstance from 'features/map/map-context.hooks'
import { useMapStyle } from 'features/map/map-style.hooks'
import { mapTilesAtom } from 'features/map/map-sources.atom'

type SourcesHookInput = string | string[]

export const useSourceInStyle = (sourcesIds: SourcesHookInput) => {
  const style = useMapStyle()
  if (!sourcesIds || !sourcesIds.length) {
    return false
  }
  const sourcesIdsList = Array.isArray(sourcesIds) ? sourcesIds : [sourcesIds]
  const sourcesLoaded = sourcesIdsList.every((source) => style?.sources?.[source] !== undefined)
  return sourcesLoaded
}

export const useMapSourceTilesLoadedAtom = () => {
  // Used it once in Map.tsx the listeners only once
  const map = useMapInstance()
  const setSourceTilesLoaded = useSetRecoilState(mapTilesAtom)

  useEffect(() => {
    if (!map) return

    // TODO: include sourceId in typedefinition fork
    const onSourceDataLoading = (e: any) => {
      const { sourceId } = e
      if (sourceId) {
        setSourceTilesLoaded((state) => ({ ...state, [sourceId]: false }))
      }
    }

    // TODO: include sourceId in typedefinition fork
    const onSourceTilesLoaded = (e: any) => {
      const { sourceId } = e
      if (sourceId) {
        setSourceTilesLoaded((state) => ({ ...state, [sourceId]: true }))
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

export const useMapSourceTiles = () => {
  const sourceTilesLoaded = useRecoilValue(mapTilesAtom)
  return sourceTilesLoaded
}

export const useMapSourceTilesLoaded = (sourcesId: SourcesHookInput) => {
  const sourceTilesLoaded = useMapSourceTiles()
  const sourceInStyle = useSourceInStyle(sourcesId)
  const sourcesIdsList = Array.isArray(sourcesId) ? sourcesId : [sourcesId]
  return sourceInStyle && sourcesIdsList.every((source) => sourceTilesLoaded[source])
}
