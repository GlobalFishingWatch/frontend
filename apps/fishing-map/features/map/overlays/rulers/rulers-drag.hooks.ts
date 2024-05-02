import { useCallback, useRef } from 'react'
import { useSelector } from 'react-redux'
import { throttle } from 'lodash'
import type { PickingInfo } from '@deck.gl/core'
import type {
  RulerData,
  RulerPickingObject,
  RulerPointProperties,
} from '@globalfishingwatch/deck-layers'
import { InteractionEvent } from '@globalfishingwatch/deck-layer-composer'
import { selectMapRulersVisible } from 'features/app/selectors/app.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { isRulerLayerPoint } from 'features/map/map-interaction.utils'

export function useMapRulersDrag() {
  const rulers = useSelector(selectMapRulersVisible)
  const { dispatchQueryParams } = useLocationConnect()

  const draggedRuler = useRef<{
    ruler: RulerData | undefined
    order: RulerPointProperties['order']
    id: RulerPointProperties['id']
  } | null>(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdate = useCallback(
    throttle((mapRulers) => {
      dispatchQueryParams({ mapRulers })
    }, 200),
    [dispatchQueryParams]
  )

  const onRulerDrag = useCallback(
    (info: PickingInfo) => {
      if (!draggedRuler.current) return
      const [longitude, latitude] = info.coordinate as number[]
      const newRulers = rulers.map((r) => {
        if (Number(r.id) === draggedRuler.current?.id) {
          return draggedRuler.current.order === 'start'
            ? { ...r, start: { longitude, latitude } }
            : { ...r, end: { longitude, latitude } }
        } else {
          return r
        }
      })
      debouncedUpdate(newRulers)
    },
    [debouncedUpdate, rulers]
  )

  const onRulerDragStart = useCallback(
    (interaction: InteractionEvent | undefined) => {
      if (!interaction) return
      const { features } = interaction
      if (features?.some(isRulerLayerPoint)) {
        const point = features?.find(isRulerLayerPoint) as RulerPickingObject
        draggedRuler.current = {
          ruler: rulers.find((r) => Number(r.id) === point.properties.id),
          order: point.properties.order,
          id: point.properties.id,
        }
      }
    },
    [rulers]
  )
  const onRulerDragEnd = useCallback(() => {
    draggedRuler.current = null
  }, [])
  return { onRulerDrag, onRulerDragStart, onRulerDragEnd }
}
