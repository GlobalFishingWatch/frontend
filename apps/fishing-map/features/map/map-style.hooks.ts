import { ExtendedStyle } from '@globalfishingwatch/layer-composer'
import useMapInstance from 'features/map/map-context.hooks'
import { useMapLoaded } from 'features/map/map-state.hooks'

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
