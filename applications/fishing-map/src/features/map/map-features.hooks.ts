import { useEffect, useMemo } from 'react'
import { atom, useRecoilValue, useSetRecoilState } from 'recoil'
import useMapInstance from 'features/map/map-context.hooks'
import { useMapStyle } from './map.hooks'

export const mapIdleAtom = atom<boolean>({
  key: 'mapIdle',
  default: false,
})

export const useSetMapIdleAtom = () => {
  // Used it once in Map.tsx the listeners only once
  const map = useMapInstance()
  const setIdle = useSetRecoilState(mapIdleAtom)

  useEffect(() => {
    if (!map) return
    const setIdleState = () => {
      setIdle(true)
    }
    const resetIdleState = () => {
      setIdle(false)
    }
    if (map) {
      map.on('sourcedata', resetIdleState)
      map.on('idle', setIdleState)
    }
    const detachListeners = () => {
      map.off('idle', setIdleState)
      map.off('sourcedata', resetIdleState)
    }

    return detachListeners
  }, [map, setIdle])
}

export const useMapIdle = () => {
  const idle = useRecoilValue(mapIdleAtom)
  return idle
}

export const useMapLoaded = () => {
  const idle = useRecoilValue(mapIdleAtom)
  const map = useMapInstance()
  const mapInstanceReady = map !== null
  const mapFirstLoad = (map as any)?._loaded || false
  const mapStyleLoad = map?.isStyleLoaded() || false
  const areTilesLoaded = map?.areTilesLoaded() || false
  const loaded = mapInstanceReady && mapFirstLoad && (idle || areTilesLoaded || mapStyleLoad)
  return loaded
}

export const useHaveSourcesLoaded = (sourcesIds: string | string[]) => {
  const sourcesIdsList = Array.isArray(sourcesIds) ? sourcesIds : [sourcesIds]
  const mapLoaded = useMapLoaded()
  const style = useMapStyle()

  const sourcesLoaded = sourcesIdsList.every((source) => style?.sources?.[source] !== undefined)
  return mapLoaded && sourcesLoaded
}

// TODO Deprecate
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
