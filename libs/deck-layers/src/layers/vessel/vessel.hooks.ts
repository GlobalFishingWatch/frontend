import { useEffect, useMemo } from 'react'
import { Layer } from '@deck.gl/core/typed'
import { atom, useSetAtom, useAtomValue } from 'jotai'
import { selectAtom } from 'jotai/utils'
import { EventTypes } from '@globalfishingwatch/api-types'
import { VesselDeckLayersGenerator } from '@globalfishingwatch/deck-layers'
import { hexToDeckColor } from '../../utils/colors'
import { VesselLayer } from './VesselLayer'

const dateToMs = (date: string) => {
  return new Date(date).getTime()
}

interface VesselLayerState {
  id: string
  instance: VesselLayer
  loadedLayers: string[]
}

export const vesselLayersAtom = atom<VesselLayerState[]>([])
export const vesselLayersSelector = (layers: VesselLayerState[]) => layers
export const vesselLayersInstancesSelector = atom((get) =>
  get(vesselLayersAtom).map((l) => l.instance)
)

export const selectVesselsLayersAtom = selectAtom(vesselLayersAtom, vesselLayersSelector)

// TODO this should be moved to a root configuration
interface globalConfig {
  start?: string
  end?: string
  // hoveredFeatures: PickingInfo[]
  // clickedFeatures: PickingInfo[]
  highlightedTime?: { start: string; end: string }
  visibleEvents?: EventTypes[]
}

export type VesselDeckLayersParams = {
  highlightedTime?: { start: string; end: string }
  highlightEventIds?: string[]
}

export const useVesselLayers = () => useAtomValue(vesselLayersInstancesSelector)
export const useSetVesselLayers = (
  vesselLayersGenerator: VesselDeckLayersGenerator[],
  globalConfig: globalConfig,
  params?: VesselDeckLayersParams
) => {
  const { start, end } = globalConfig
  const { highlightedTime, highlightEventIds } = params || {}

  const setVesselLayers = useSetAtom(vesselLayersAtom)
  const vesselLayers = useAtomValue(selectVesselsLayersAtom)

  const setVesselLoadedState = useSetAtom(
    atom(null, (get, set, id: VesselLayerState['id']) =>
      set(vesselLayersAtom, (prevVessels) => {
        return prevVessels.map((v) => {
          if (id.includes(v.id)) {
            return {
              ...v,
              loadedLayers: [...v.loadedLayers, id],
            }
          }
          return v
        })
      })
    )
  )

  const onDataLoad = (data: any, context: { propName: string; layer: Layer<any> }) => {
    setVesselLoadedState(context.layer.id)
  }
  const highlightStartTime = useMemo(
    () => highlightedTime && dateToMs(highlightedTime?.start),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [highlightedTime?.start]
  )
  const highlightEndTime = useMemo(
    () => highlightedTime && dateToMs(highlightedTime?.end),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [highlightedTime?.end]
  )
  const startTime = useMemo(() => (start ? dateToMs(start) : undefined), [start])
  const endTime = useMemo(() => (end ? dateToMs(end) : undefined), [end])

  useEffect(() => {
    const newVesselLayerInstances = vesselLayersGenerator.map(
      (vesselGenerator: VesselDeckLayersGenerator) => {
        const { id, visible, color, visibleEvents, trackUrl, events, name } = vesselGenerator
        // TODO not load layer data if not visible for first time
        // const alreadyInstanceLayer = vesselLayers.find((v: any) => v.id === id) !== undefined
        const instance = new VesselLayer({
          id,
          visible,
          name,
          endTime,
          trackUrl,
          startTime,
          color: hexToDeckColor(color),
          events,
          onDataLoad,
          // hoveredFeatures,
          // clickedFeatures,
          highlightEndTime,
          highlightStartTime,
          highlightEventIds,
          visibleEvents,
          // eventsResource: eventsData?.length ? parseEvents(eventsData) : [],
        })
        return {
          id,
          instance,
          loadedLayers: vesselLayers.find((v: any) => v.id === id)?.loadedLayers || [],
        }
      }
    )

    setVesselLayers(newVesselLayerInstances)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, end, highlightEndTime, highlightStartTime, vesselLayersGenerator])
  return useAtomValue(vesselLayersInstancesSelector)
}
