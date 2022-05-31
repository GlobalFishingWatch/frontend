import { useMap } from 'react-map-gl'

export default function useMapInstance() {
  // const { map } = useMap()
  const mapInstances = useMap()
  console.log(mapInstances)
  const map = mapInstances.map
  return map?.getMap() as any as maplibregl.Map
}
