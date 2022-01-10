import { useRecoilValue } from 'recoil'
import { ExtendedStyle } from '@globalfishingwatch/layer-composer'
import useMapInstance from 'features/map/map-context.hooks'
import { mapIdleAtom } from 'features/map/map-features.atom'

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

export const useMapStyle = () => {
  const map = useMapInstance()

  // Used to ensure the style is refreshed on load finish
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const mapLoaded = useMapLoaded()

  if (!map) return null

  let style: ExtendedStyle
  try {
    style = map.getStyle()
  } catch (e: any) {
    return null
  }

  return style
}
