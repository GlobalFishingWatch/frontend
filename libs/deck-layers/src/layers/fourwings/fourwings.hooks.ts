import { useEffect, useMemo } from 'react'
import { atom, useSetAtom, useAtomValue } from 'jotai'
import { selectAtom } from 'jotai/utils'
import { groupBy } from 'lodash'
import { DataviewCategory, EventTypes } from '@globalfishingwatch/api-types'
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
  fourwingsLayersGenerator: FourwingsDeckLayerGenerator[],
  globalConfig: globalConfig
) => {
  const { start, end } = globalConfig

  const setFourwingsLayers = useSetAtom(fourwingsLayersAtom)

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

  const onViewportLoad = (id: string) => {
    setFourwingsLoadedState(id)
  }

  const startTime = useMemo(() => (start ? dateToMs(start) : undefined), [start])
  const endTime = useMemo(() => (end ? dateToMs(end) : undefined), [end])
  const visibleSubayersIds = useMemo(
    () => fourwingsLayersGenerator.filter((l) => l.visible).map((l) => l.id),
    [fourwingsLayersGenerator]
  )

  useEffect(() => {
    const groupedLayers = groupBy(fourwingsLayersGenerator, 'category')
    Object.keys(groupedLayers).forEach((category) => {
      if (groupedLayers[category].some((sublayer) => sublayer.visible)) {
        const instance = new FourwingsLayer({
          minFrame: startTime,
          maxFrame: endTime,
          // mode: activityMode,
          mode: 'heatmap',
          debug: false,
          visibleSubayersIds,
          sublayers: groupedLayers[category].filter((l) => l.visible).flatMap((l) => l.sublayers),
          category: category as DataviewCategory,
          onViewportLoad,
          // onVesselHighlight: onVesselHighlight,
          // onVesselClick: onVesselClick,
          // resolution: 'high',
          // hoveredFeatures: hoveredFeatures,
          // clickedFeatures: clickedFeatures,
        })
        setFourwingsLayers((prevVessels) => {
          const updatedVessels = prevVessels.filter((v) => v.id !== category)
          updatedVessels.push({
            id: category,
            instance,
            loaded: false,
          })
          return updatedVessels
        })
      }
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, end, visibleSubayersIds])
  return useAtomValue(fourwingsLayersInstancesSelector)
}
