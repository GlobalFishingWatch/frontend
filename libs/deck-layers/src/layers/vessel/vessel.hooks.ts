import { useEffect, useRef, useMemo } from 'react'
import { PickingInfo, LayerData, Layer } from '@deck.gl/core/typed'
import { atom, useSetAtom, useAtom, useAtomValue } from 'jotai'
import { selectAtom, splitAtom } from 'jotai/utils'
import { focusAtom } from 'jotai-optics'
import type { OpticFor } from 'optics-ts'
import { START_TIMESTAMP } from '../../loaders/constants'
import { VesselEventsLayer } from './VesselEventsLayer'
import { VesselTrackLayer } from './VesselTrackLayer'
import { VesselLayer } from './VesselLayer'

const dateToMs = (date: string) => {
  return new Date(date).getTime()
}

interface VesselLayerState {
  vesselId: string
  instance: VesselLayer
  trackDataLoaded: boolean
  eventsDataLoaded: boolean
}

const vesselLayerStateAtom = atom<VesselLayerState[]>([
  {
    vesselId: 'vesselId',
    instance: new VesselLayer({}),
    trackDataLoaded: false,
    eventsDataLoaded: false,
  },
])
const vesselsAtomsAtom = splitAtom(vesselLayerStateAtom)
// const focusInstancesAtom = focusAtom(vesselsAtomsAtom, (optic) => optic.prop('instance'))

interface VesselLayerData {
  id: string
  loaded?: boolean
  instance: VesselLayer
}

export const vesselLayersAtom = atom<VesselLayerData[]>([])
export const vesselLayersSelector = (layers: VesselLayerData[]) => layers
export const vesselLayersInstancesSelector = atom((get) =>
  get(vesselLayersAtom).map((l) => l.instance)
)

export const selectVesselsLayersAtom = selectAtom(vesselLayersAtom, vesselLayersSelector)

interface globalConfig {
  start: string
  end: string
  hoveredFeatures: PickingInfo[]
  clickedFeatures: PickingInfo[]
  highlightedTime?: { start: string; end: string }
}

interface commonGeneratorConfig {
  id: string
  color: string
  visible: boolean
}

interface vesselGeneratorConfig extends commonGeneratorConfig {
  vesselId: string
  eventsUrls: string[]
  trackUrl: string
}

export const useVesselsLayers = (
  vesselGeneratorConfig: vesselGeneratorConfig[],
  globalConfig: globalConfig,
  vesselLayersGeneratorsIds: string[],
  highlightedTime?: { start: string; end: string }
) => {
  const { start, end, hoveredFeatures, clickedFeatures } = globalConfig

  const setVesselLayers = useSetAtom(vesselLayersAtom)
  const vs = useAtomValue(vesselLayersAtom)
  let vesselsLayers = useRef([] as VesselLayerData[])
  const setVesselLoadedAtom = atom(null, (get, set, id: VesselLayerData['id']) => {
    const layerToUpdate = get(vesselLayersAtom).find((l) => id.includes(l.id))!
    console.log(
      '🚀 ~ file: vessel.hooks.ts:81 ~ setVesselLoadedAtom ~ layerToUpdate:',
      layerToUpdate
    )

    set(vesselLayersAtom, [
      ...get(vesselLayersAtom).filter((l) => !id.includes(l.id)),
      { ...layerToUpdate, loaded: true },
    ])
  })
  const setVesselLoadedState = useSetAtom(setVesselLoadedAtom)
  const onDataLoad = (data: LayerData<any>, context: { propName: string; layer: Layer<any> }) => {
    setVesselLoadedState(context.layer.id)
  }
  const highlightStartTime = useMemo(
    () => highlightedTime && dateToMs(highlightedTime?.start) - START_TIMESTAMP,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [highlightedTime?.start]
  )
  const highlightEndTime = useMemo(
    () => highlightedTime && dateToMs(highlightedTime?.end) - START_TIMESTAMP,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [highlightedTime?.end]
  )
  const startTime = useMemo(() => dateToMs(start) - START_TIMESTAMP, [start])
  const endTime = useMemo(() => dateToMs(end) - START_TIMESTAMP, [end])
  useEffect(() => {
    vesselGeneratorConfig.forEach((vesselConfig) => {
      const { vesselId: id, color: themeColor, eventsUrls, trackUrl } = vesselConfig

      const instance = new VesselLayer({
        id,
        visible: true,
        endTime,
        trackUrl,
        startTime,
        themeColor,
        eventsUrls,
        onDataLoad,
        hoveredFeatures,
        clickedFeatures,
        highlightEndTime,
        highlightStartTime,
      })
      vesselsLayers.current = [
        ...vesselsLayers.current.filter((v) => v.id !== id),
        {
          id,
          // loaded: vs.find((v) => v.id === id)?.loaded || false,
          instance,
        },
      ]
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vesselLayersGeneratorsIds, start, end, highlightEndTime, highlightStartTime, vs])
  setVesselLayers(vesselsLayers.current)
}
