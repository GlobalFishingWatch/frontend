import { useMap } from 'react-map-gl'

export default function useMapInstance() {
  const { map } = useMap()
  return map?.getMap() as any as maplibregl.Map
}
