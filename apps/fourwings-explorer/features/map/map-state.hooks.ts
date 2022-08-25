import { useEffect } from 'react'
import { atom, useRecoilValue, useSetRecoilState } from 'recoil'
import useMapInstance from 'features/map/map-context.hooks'

export const mapIdleAtom = atom<boolean>({
  key: 'mapIdle',
  default: false,
})

export const mapReadyAtom = atom<boolean>({
  key: 'mapReady',
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
    const resetIdleState = (e) => {
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

export const useMapReady = () => {
  const loaded = useRecoilValue(mapReadyAtom)
  return loaded
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
