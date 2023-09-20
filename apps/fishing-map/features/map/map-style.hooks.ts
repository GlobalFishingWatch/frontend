import { ExtendedStyle } from '@globalfishingwatch/layer-composer'
import useMapInstance from 'features/map/map-context.hooks'
import { useMapLoaded } from 'features/map/map-state.hooks'

export const useMapStyle = () => {
  const map = useMapInstance()

  // Used to ensure the style is refreshed on load finish
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const mapLoaded = useMapLoaded()
  let style = {} as ExtendedStyle

  if (!map) return style

  try {
    style = map.getStyle() as ExtendedStyle
  } catch (e: any) {
    console.warn(e)
  }

  return style
}
