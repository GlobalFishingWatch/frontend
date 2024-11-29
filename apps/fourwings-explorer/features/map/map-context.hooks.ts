import { useMap } from 'react-map-gl'
import type { ExtendedStyle } from '@globalfishingwatch/layer-composer'
import { useMapLoaded } from 'features/map/map-state.hooks'

export default function useMapInstance() {
  const { map } = useMap()
  return map?.getMap() as any as maplibregl.Map
}

export function useMapInstanceStyle() {
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
