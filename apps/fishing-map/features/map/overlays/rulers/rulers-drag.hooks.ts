import { useCallback, useRef } from 'react'
import { useSelector } from 'react-redux'
import type { PickingInfo } from '@deck.gl/core'
import { throttle } from 'es-toolkit'

import type {
  RulerData,
  RulerPickingObject,
  RulerPointProperties,
} from '@globalfishingwatch/deck-layers'

import { selectMapRulersVisible } from 'features/app/selectors/app.selectors'
import { useLocationConnect } from 'routes/routes.hook'

export function useMapRulersDrag() {
  const rulers = useSelector(selectMapRulersVisible)
  const { dispatchQueryParams } = useLocationConnect()

  const draggedRuler = useRef<{
    ruler: RulerData | undefined
    order: RulerPointProperties['order']
    id: RulerPointProperties['id']
  } | null>(null)

   
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
          return { ...r, [draggedRuler.current.order]: { longitude, latitude } }
        } else {
          return r
        }
      })
      debouncedUpdate(newRulers)
    },
    [debouncedUpdate, rulers]
  )

  const onRulerDragStart = useCallback(
    (info: PickingInfo) => {
      const rulerPoint = info.object as RulerPickingObject
      if (rulerPoint) {
        draggedRuler.current = {
          ruler: rulers.find((r) => Number(r.id) === rulerPoint.properties.id),
          order: rulerPoint.properties.order,
          id: rulerPoint.properties.id,
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
