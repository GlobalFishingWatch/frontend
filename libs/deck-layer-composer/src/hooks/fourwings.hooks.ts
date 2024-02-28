import { useEffect, useMemo } from 'react'
import { atom, useSetAtom, useAtomValue } from 'jotai'
import { selectAtom } from 'jotai/utils'
import { EventTypes } from '@globalfishingwatch/api-types'
import { FourwingsLayer } from '@globalfishingwatch/deck-layers'
import {
  DeckLayerBaseState,
  FourwingsDeckLayerGenerator,
  FourwingsDataviewCategory,
} from '../types'
// import { sortFourwingsLayers } from '../utils/sort'
import { getUTCDateTime } from '../utils/dates'

export interface FourwingsLayerState extends DeckLayerBaseState {
  layerInstance: FourwingsLayer
}

export const fourwingsLayersAtom = atom<FourwingsLayerState[]>([])
export const fourwingsLayersSelector = (layers: FourwingsLayerState[]) => layers

export const fourwingsLayersSortedSelector = atom(
  (get) => get(fourwingsLayersAtom)
  // get(fourwingsLayersAtom).sort((a, b) => sortFourwingsLayers(a.layerInstance, b.layerInstance))
)

export const selectFourwingsLayersAtom = selectAtom(fourwingsLayersAtom, fourwingsLayersSelector)

interface globalConfig {
  start?: string
  end?: string
  // hoveredFeatures: PickingInfo[]
  // clickedFeatures: PickingInfo[]
  highlightedTime?: { start: string; end: string }
  visibleEvents?: EventTypes[]
}
export const useFourwingsLayers = (id?: FourwingsDataviewCategory) => {
  const layers = useAtomValue(fourwingsLayersSortedSelector)
  if (id) {
    return layers.filter((l) => l.id === id)
  }
  return layers
}

export const useSetFourwingsLayers = (
  fourwingsLayerGenerators: FourwingsDeckLayerGenerator[],
  globalConfig: globalConfig
) => {
  const { start, end } = globalConfig

  const setFourwingsLayers = useSetAtom(fourwingsLayersAtom)
  const setFourwingsLoadedState = useSetAtom(
    atom(null, (get, set, { id }: { id: FourwingsLayerState['id'] }) =>
      set(fourwingsLayersAtom, (prevLayers) => {
        return prevLayers.map((v) => {
          if (v.id.includes(id)) {
            return {
              ...v,
              loaded: true,
            }
          }
          return v
        })
      })
    )
  )

  const onViewportLoad: any = (id: string) => {
    setFourwingsLoadedState({ id })
  }

  const startTime = useMemo(() => (start ? getUTCDateTime(start).toMillis() : undefined), [start])
  const endTime = useMemo(() => (end ? getUTCDateTime(end).toMillis() : undefined), [end])

  useEffect(() => {
    const totalSublayers = fourwingsLayerGenerators.reduce(
      (acc, { sublayers }) =>
        (acc += sublayers.filter((sublayer) => sublayer.config?.visible).length),
      0
    )
    fourwingsLayerGenerators.forEach(({ id, sublayers }) => {
      const visibleSublayers = sublayers.filter((sublayer) => sublayer.config?.visible)
      if (visibleSublayers.length) {
        // const previousLayer = previousLayers.length && previousLayers.find((l) => l.id === id)
        const layerInstance = new FourwingsLayer({
          minFrame: startTime,
          maxFrame: endTime,
          // mode: activityMode,
          mode: 'heatmap',
          debug: false,
          sublayers: visibleSublayers,
          colorRampWhiteEnd: totalSublayers === 1,
          category: id,
          onViewportLoad,
          // onVesselHighlight: onVesselHighlight,
          // onVesselClick: onVesselClick,
          // resolution: 'high',
          // hoveredFeatures: hoveredFeatures,
          // clickedFeatures: clickedFeatures,
        })
        setFourwingsLayers((prevVessels) => {
          const updatedVessels = prevVessels.filter((v) => v.id !== id)
          updatedVessels.push({
            id,
            layerInstance,
            loaded: false,
          })
          return updatedVessels
        })
      } else {
        // filterout the layers that are not visible
        setFourwingsLayers((previousLayers) => previousLayers.filter((l) => l.id !== id))
      }
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, endTime, fourwingsLayerGenerators])
  // TODO memoize this to avoid re-renders
  return useAtomValue(fourwingsLayersSortedSelector).map((l) => l.layerInstance)
}
