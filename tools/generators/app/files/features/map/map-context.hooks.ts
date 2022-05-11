import { useMap } from 'react-map-gl'

export default function useMapInstance() {
  const { current } = useMap()
  return current?.getMap() as any as maplibregl.Map
}
