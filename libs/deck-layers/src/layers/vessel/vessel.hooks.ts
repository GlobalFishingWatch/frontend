import { useEffect, useRef, useMemo } from 'react'
import { PickingInfo, LayerData, Layer } from '@deck.gl/core/typed'
import { atom, useSetAtom } from 'jotai'
import { selectAtom } from 'jotai/utils'
import { START_TIMESTAMP } from '../../loaders/constants'
import { VesselEventsLayer } from './VesselEventsLayer'
import { VesselTrackLayer } from './VesselTrackLayer'
import { VesselLayer } from './VesselLayer'

const dateToMs = (date: string) => {
  return new Date(date).getTime()
}

interface VesselLayerData {
  id: string
  loaded: boolean
  instance: VesselLayer
}

export const vesselLayersAtom = atom<VesselLayerData[]>([])
const vesselLayersSelector = (layers: VesselLayerData[]) => layers
export const vesselLayersInstancesSelector = atom((get) =>
  get(vesselLayersAtom).map((l) => l.instance)
)
export const selectVesselsLayersAtom = selectAtom(vesselLayersAtom, vesselLayersSelector)
const useVesselLoadedState = (id: VesselLayerData['id']) => {
  atom(null, (get, set) => {
    const layerToUpdate = get(vesselLayersAtom).find((l) => l.id === id)!
    set(vesselLayersAtom, [...get(vesselLayersAtom), { ...layerToUpdate, loaded: true }])
  })
}

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

export const useVesselsLayer = (
  vesselGeneratorConfig: vesselGeneratorConfig[],
  globalConfig: globalConfig,
  vesselLayersGeneratorsIds: string[]
) => {
  const { start, end, hoveredFeatures, clickedFeatures } = globalConfig

  const onDataLoad = (data: LayerData<any>, context: { propName: string; layer: Layer<any> }) => {
    // useVesselLayerLoadedStateAtom(context.layer.id)
    console.log('LAYER', context.layer, 'LOADED')
  }
  const setVesselLayers = useSetAtom(vesselLayersAtom)
  let vesselsLayers = useRef([] as VesselLayerData[])
  // const highlightStartTime = useMemo(
  //   () => highlightedTime && dateToMs(highlightedTime?.start) - START_TIMESTAMP,
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [highlightedTime?.start]
  // )
  // const highlightEndTime = useMemo(
  //   () => highlightedTime && dateToMs(highlightedTime?.end) - START_TIMESTAMP,
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [highlightedTime?.end]
  // )
  // const startTime = useMemo(() => dateToMs(start) - START_TIMESTAMP, [start])
  // const endTime = useMemo(() => dateToMs(end) - START_TIMESTAMP, [end])
  useEffect(() => {
    vesselGeneratorConfig.forEach((vesselConfig) => {
      const { vesselId: id, color: themeColor, eventsUrls, trackUrl } = vesselConfig
      console.log(
        '🚀 ~ file: vessel.hooks.ts:84 ~ vesselGeneratorConfig.forEach ~ trackUrl:',
        trackUrl,
        start,
        end
      )

      const instance = new VesselLayer({
        id,
        visible: true,
        endTime: dateToMs(end) - START_TIMESTAMP,
        trackUrl,
        startTime: dateToMs(start) - START_TIMESTAMP,
        themeColor,
        eventsUrls,
        onDataLoad,
        hoveredFeatures,
        clickedFeatures,
        // highlightEndTime,
        // highlightStartTime,
      })
      vesselsLayers.current = [
        ...vesselsLayers.current.filter((v) => v.id !== id),
        {
          id,
          loaded: false,
          instance,
        },
      ]
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vesselLayersGeneratorsIds, start, end])
  setVesselLayers(vesselsLayers.current)
}
