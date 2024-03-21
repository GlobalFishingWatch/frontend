import { useCallback, useRef } from 'react'
import { useSelector } from 'react-redux'
import { throttle } from 'lodash'
import { PickingInfo } from '@deck.gl/core/typed'
import { RulerData, RulerPointProperties } from '@globalfishingwatch/deck-layers'
import { useDeckMap } from 'features/map/map-context.hooks'
import { selectMapRulersVisible } from 'features/app/selectors/app.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { isRulerLayerPoint } from 'features/map/map-interaction.utils'

export function useMapRulersDrag() {
  const deck = useDeckMap()
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
      const [longitude, latitude] = info.coordinate as number[]
      const newRulers = rulers.map((r) => {
        if (r.id === draggedRuler.current?.id) {
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
    (info: PickingInfo, features: any) => {
      if (features?.some(isRulerLayerPoint)) {
        deck?.setProps({ controller: { dragPan: false } })
        const point = features.find(isRulerLayerPoint).object
        draggedRuler.current = {
          ruler: rulers.find((r) => r.id === point.properties.id),
          order: point.properties.order,
          id: point.properties.id,
        }
      }
    },
    [deck, rulers]
  )
  return { onRulerDrag, onRulerDragStart }
}
