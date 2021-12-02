import { useEffect } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import useMapInstance from 'features/map/map-context.hooks'
import { useMapLoaded, useMapStyle } from 'features/map/map-style.hooks'
import { mapIdleAtom } from 'features/map/map-features.atom'

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

export const useSourceInStyle = (sourcesIds: string | string[]) => {
  const style = useMapStyle()
  const sourcesIdsList = Array.isArray(sourcesIds) ? sourcesIds : [sourcesIds]
  const sourcesLoaded = sourcesIdsList.every((source) => style?.sources?.[source] !== undefined)
  return sourcesLoaded
}

export const useMapAndSourcesLoaded = (sourcesIds: string | string[]) => {
  const mapLoaded = useMapLoaded()
  const sourcesLoaded = useSourceInStyle(sourcesIds)
  return mapLoaded && sourcesLoaded
}
