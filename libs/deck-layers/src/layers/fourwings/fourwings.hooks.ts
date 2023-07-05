import { useEffect, useMemo } from 'react'
import { atom, useSetAtom, useAtomValue } from 'jotai'
import { selectAtom } from 'jotai/utils'
import { EventTypes } from '@globalfishingwatch/api-types'
import { FourwingsDeckLayerGenerator } from '../../layer-composer/types'
import { sortFourwingsLayers } from '../../utils/sort'
import { FourwingsLayer } from './FourwingsLayer'

const dateToMs = (date: string) => {
  return new Date(date).getTime()
}

interface FourwingsLayerState {
  id: string
  instance: FourwingsLayer
  loaded: boolean
}

export const fourwingsLayersAtom = atom<FourwingsLayerState[]>([])
export const fourwingsLayersSelector = (layers: FourwingsLayerState[]) => layers

export const fourwingsLayersInstancesSelector = atom((get) =>
  get(fourwingsLayersAtom)
    .map((l) => l.instance)
    .sort(sortFourwingsLayers)
)

const fourwingsActivityLayerSelector = atom((get) =>
  get(fourwingsLayersAtom).find((l) => l.id.includes('activity'))
)

export const fourwingsLayersLoadedSelector = atom((get) =>
  get(fourwingsLayersAtom).map((l) => ({ id: l.id, loaded: l.loaded }))
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
export const useFourwingsLayers = () => useAtomValue(fourwingsLayersInstancesSelector)
export const useFourwingsLayersLoaded = () => useAtomValue(fourwingsLayersLoadedSelector)
export const useFourwingsActivityLayer = () => useAtomValue(fourwingsActivityLayerSelector)

export const useSetFourwingsLayers = (
  fourwingsLayerGenerators: FourwingsDeckLayerGenerator[],
  globalConfig: globalConfig
) => {
  const { start, end } = globalConfig

  const setFourwingsLayers = useSetAtom(fourwingsLayersAtom)
  const previousLayers = useAtomValue(fourwingsLayersAtom)
  const setFourwingsLoadedState = useSetAtom(
    atom(null, (get, set, id: FourwingsLayerState['id']) =>
      set(fourwingsLayersAtom, (prevVessels) => {
        return prevVessels.map((v) => {
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
    setFourwingsLoadedState(id)
  }

  const startTime = useMemo(() => (start ? dateToMs(start) : undefined), [start])
  const endTime = useMemo(() => (end ? dateToMs(end) : undefined), [end])

  useEffect(() => {
    fourwingsLayerGenerators.forEach(({ id, sublayers }) => {
      if (sublayers.some((l) => l.visible)) {
        // const previousLayer = previousLayers.length && previousLayers.find((l) => l.id === id)
        const instance = new FourwingsLayer({
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
            instance,
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
  return useAtomValue(fourwingsLayersInstancesSelector)
}
