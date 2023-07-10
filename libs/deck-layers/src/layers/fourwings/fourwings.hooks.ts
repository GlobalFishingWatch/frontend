import { useEffect, useMemo } from 'react'
import { atom, useSetAtom, useAtomValue } from 'jotai'
import { selectAtom } from 'jotai/utils'
import { EventTypes } from '@globalfishingwatch/api-types'
import { DeckLayerBaseState, FourwingsDeckLayerGenerator } from '../../layer-composer/types'
import { sortFourwingsLayers } from '../../utils/sort'
import { FourwingsDataviewCategory } from '../../layer-composer/types/fourwings'
import { FourwingsLayer } from './FourwingsLayer'

const dateToMs = (date: string) => {
  return new Date(date).getTime()
}

export interface FourwingsLayerState extends DeckLayerBaseState {
  layerInstance: FourwingsLayer
}

export const fourwingsLayersAtom = atom<FourwingsLayerState[]>([])
export const fourwingsLayersSelector = (layers: FourwingsLayerState[]) => layers

export const fourwingsLayersSortedSelector = atom((get) =>
  get(fourwingsLayersAtom).sort((a, b) => sortFourwingsLayers(a.layerInstance, b.layerInstance))
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
export const useFourwingsLayers = (id: FourwingsDataviewCategory) => {
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

  const startTime = useMemo(() => (start ? dateToMs(start) : undefined), [start])
  const endTime = useMemo(() => (end ? dateToMs(end) : undefined), [end])

  useEffect(() => {
    fourwingsLayerGenerators.forEach(({ id, sublayers }) => {
      if (sublayers.some((l) => l.visible)) {
        // const previousLayer = previousLayers.length && previousLayers.find((l) => l.id === id)
        const layerInstance = new FourwingsLayer({
          minFrame: startTime,
          maxFrame: endTime,
          // mode: activityMode,
          mode: 'heatmap',
          debug: false,
          sublayers,
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
