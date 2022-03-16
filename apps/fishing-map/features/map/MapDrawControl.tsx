import MapboxDraw, {
  DrawCreateEvent,
  DrawModeChageEvent,
  DrawSelectionChangeEvent,
  DrawUpdateEvent,
} from '@mapbox/mapbox-gl-draw'
import { useControl } from 'react-map-gl'
import type { MapRef, ControlPosition } from 'react-map-gl'
import { useEffect } from 'react'

type ControlTypes =
  | 'point'
  | 'line_string'
  | 'polygon'
  | 'trash'
  | 'combine_features'
  | 'uncombine_features'

type DrawControlProps = {
  keybindings?: boolean
  touchEnable?: boolean
  boxSelect?: boolean
  clickBuffer?: number
  touchBuffer?: number
  controls?: Partial<{ [name in ControlTypes]: boolean }>
  displayControlsDefault?: boolean
  styles?: any
  modes?: any
  defaultMode?: string
  userProperties?: boolean

  position?: ControlPosition

  onCreate?: (e: DrawCreateEvent) => void
  onUpdate?: (e: DrawUpdateEvent) => void
  onModeChange?: (e: DrawModeChageEvent) => void
  onSelectionChange?: (e: DrawSelectionChangeEvent) => void
}

const defaultFn = () => {}
export default function useDrawControl(props: DrawControlProps) {
  const {
    onCreate = defaultFn,
    onUpdate = defaultFn,
    onModeChange = defaultFn,
    onSelectionChange = defaultFn,
  } = props
  const drawControl = useControl(
    ({ map }: { map: MapRef }) => {
      map.on('draw.create', onCreate)
      map.on('draw.update', onUpdate)
      map.on('draw.modechange', onModeChange)
      map.on('draw.selectionchange', onSelectionChange)
      return new MapboxDraw(props)
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
