import { useMap } from 'react-map-gl/maplibre'
import type { Map } from 'maplibre-gl'

export default function useMapInstance() {
  const { map } = useMap()
  return map?.getMap() as any as Map
}
