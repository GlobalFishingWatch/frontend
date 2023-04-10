import { useCallback, useEffect } from 'react'
import { PickingInfo } from '@deck.gl/core/typed'
import { useAtom, atom } from 'jotai'
import { selectAtom } from 'jotai/utils'
import { START_TIMESTAMP } from '../../loaders/constants'
import { VesselLayer } from './VesselLayer'

const dateToMs = (date: string) => {
  console.log('date', date)
  return new Date(date).getTime()
}

type VesselLayerAtomType = {
  loaded: boolean
  instance?: VesselLayer
}

export const vesselLayerAtom = atom<VesselLayerAtomType>({
  loaded: false,
})

export function useVesselLayer({
  id,
  color,
  visible,
  endDate,
  startDate,
  hoveredFeatures,
  clickedFeatures,
}: {
  id: string
  color: string
  visible: boolean
  endDate: string
  startDate: string
  hoveredFeatures: PickingInfo[]
  clickedFeatures: PickingInfo[]
}) {
  const [{ instance, loaded }, updateAtom] = useAtom(vesselLayerAtom)
  // const [highlightTimerange] = useHighlightTimerange()
  const startTime = dateToMs(startDate) - START_TIMESTAMP
  const endTime = dateToMs(endDate) - START_TIMESTAMP
  // const highlightStartTime = dateToMs(highlightTimerange?.start)
  // const highlightEndTime = dateToMs(highlightTimerange?.end)

  const onDataLoad = useCallback(() => {
    updateAtom({ loaded: true })
  }, [updateAtom])

  useEffect(() => {
    if (visible) {
      const vesselsLayer = new VesselLayer({
        id,
        color,
        endTime,
        startTime,
        hoveredFeatures,
        clickedFeatures,
        onDataLoad: onDataLoad,
      })
      updateAtom({ instance: vesselsLayer })
    } else {
      updateAtom({ instance: undefined, loaded: false })
    }
  }, [
    id,
    color,
    loaded,
    visible,
    endTime,
    startTime,
    updateAtom,
    onDataLoad,
    hoveredFeatures,
    clickedFeatures,
  ])

  return instance
}

export function useVesselLayerInstance() {
  return selectAtom(vesselLayerAtom, (layer: VesselLayerAtomType) => layer.instance)
}

export function useVesselLayerLoaded() {
  return selectAtom(vesselLayerAtom, (layer: VesselLayerAtomType) => layer.loaded)
}
