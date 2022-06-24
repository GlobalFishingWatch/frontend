import MapboxDraw, {
  DrawCreateEvent,
  DrawModeChageEvent,
  DrawSelectionChangeEvent,
  DrawUpdateEvent,
} from '@mapbox/mapbox-gl-draw'
import { useControl } from 'react-map-gl'
import type { MapRef, ControlPosition } from 'react-map-gl'
import { useEffect } from 'react'

type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
  position?: ControlPosition
  onCreate?: (e: DrawCreateEvent) => void
  onUpdate?: (e: DrawUpdateEvent) => void
  onModeChange?: (e: DrawModeChageEvent) => void
  onSelectionChange?: (e: DrawSelectionChangeEvent) => void
}

const defaultFn = () => {
  return
}
const styles = [
  // line stroke
  {
    id: 'gl-draw-line',
    type: 'line',
    filter: ['all', ['==', '$type', 'LineString'], ['!=', 'mode', 'static']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': 'rgb(38, 181, 242)',
      'line-dasharray': [0.2, 2],
      'line-width': 2,
    },
  },
  // polygon fill
  {
    id: 'gl-draw-polygon-fill',
    type: 'fill',
    filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
    paint: {
      'fill-color': 'rgb(189,189,189)',
      'fill-outline-color': 'transparent',
      'fill-opacity': 0.1,
    },
  },
  // polygon mid points
  {
    id: 'gl-draw-polygon-midpoint',
    type: 'circle',
    filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'midpoint']],
    paint: {
      'circle-radius': 4,
      'circle-color': 'rgb(122,202,67)',
    },
  },
  // polygon outline stroke
  // This doesn't style the first edge of the polygon, which uses the line stroke styling instead
  {
    id: 'gl-draw-polygon-stroke-active',
    type: 'line',
    filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': 'rgb(38, 181, 242)',
      'line-dasharray': [0.2, 2],
      'line-width': 2,
    },
  },
  // vertex point halos
  {
    id: 'gl-draw-polygon-and-line-vertex-halo-active',
    type: 'circle',
    filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
    paint: {
      'circle-radius': 4,
      'circle-color': '#FFF',
    },
  },
  // vertex points
  {
    id: 'gl-draw-polygon-and-line-vertex-active',
    type: 'circle',
    filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
    paint: {
      'circle-radius': 5,
      'circle-color': 'rgb(122,202,67)',
      'circle-stroke-color': 'rgb(38, 181, 242)',
      'circle-stroke-width': 1,
    },
  },
  // polygon fill
  {
    id: 'gl-draw-polygon-fill-active',
    type: 'fill',
    filter: ['all', ['==', '$type', 'Polygon'], ['==', 'mode', 'direct_select']],
    paint: {
      'fill-color': 'rgb(189,189,189)',
      'fill-outline-color': 'transparent',
      'fill-opacity': 0.3,
    },
  },
  // polygon outline
  {
    id: 'gl-draw-polygon-stroke-static',
    type: 'line',
    filter: ['all', ['==', '$type', 'Polygon'], ['==', 'mode', 'static']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': '#000',
      'line-width': 3,
    },
  },
]

export default function useDrawControl(props: DrawControlProps) {
  const {
    onCreate = defaultFn,
    onUpdate = defaultFn,
    onModeChange = defaultFn,
    onSelectionChange = defaultFn,
  } = props

  const drawControl = useControl<MapboxDraw>(
    ({ map }: { map: MapRef }) => {
      map.on('draw.create', onCreate)
      map.on('draw.update', onUpdate)
      map.on('draw.modechange', onModeChange)
      map.on('draw.selectionchange', onSelectionChange)
      return new MapboxDraw({ ...props, styles })
    },
    ({ map }: { map: MapRef }) => {
      map.off('draw.create', onCreate)
      map.off('draw.update', onUpdate)
      map.off('draw.modechange', onModeChange)
      map.off('draw.selectionchange', onSelectionChange)
    },
    {
      position: props.position,
    }
  )

  useEffect(() => {
    if (drawControl) {
      drawControl.deleteAll()
      drawControl.changeMode(props.defaultMode as any)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawControl])

  return drawControl
}
