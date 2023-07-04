import { useEffect, useMemo } from 'react'
import { PickingInfo, LayerData, Layer } from '@deck.gl/core/typed'
import { atom, useSetAtom, useAtomValue } from 'jotai'
import { selectAtom } from 'jotai/utils'
import { EventTypes } from '@globalfishingwatch/api-types'
import { FourwingsDeckLayerGenerator } from '@globalfishingwatch/deck-layers'
import { START_TIMESTAMP } from '../../loaders/constants'
import { parseEvents } from '../../loaders/vessels/eventsLoader'
import { FourwingsLayer } from './FourwingsLayer'
import { FourwingsSublayer } from './fourwings.types'

export const FOURWINGS_SUBLAYERS: FourwingsSublayer[] = [
  {
    id: 'ais',
    datasets: ['public-global-fishing-effort:v20201001'],
    config: {
      color: '#FF64CE',
      colorRamp: 'magenta',
      visible: true,
    },
  },
  {
    id: 'vms-brazil-and-panama',
    datasets: [
      'public-bra-onyxsat-fishing-effort:v20211126',
      'public-panama-fishing-effort:v20211126',
    ],
    config: {
      color: '#00EEFF',
      colorRamp: 'sky',
      visible: true,
    },
  },
  {
    id: 'vms-chile',
    datasets: ['public-chile-fishing-effort:v20211126'],
    config: {
      color: '#A6FF59',
      colorRamp: 'green',
      visible: true,
    },
  },
  {
    id: 'vms-ecuador',
    datasets: ['public-ecuador-fishing-effort:v20211126'],
    config: {
      color: '#FFAA0D',
      colorRamp: 'orange',
      visible: true,
    },
  },
]

const dateToMs = (date: string) => {
  return new Date(date).getTime()
}

interface FourwingsLayerState {
  id: string
  instance: FourwingsLayer
  loadedLayers: string[]
}

export const fourwingsLayersAtom = atom<FourwingsLayerState[]>([])
export const fourwingsLayersSelector = (layers: FourwingsLayerState[]) => layers
export const fourwingsLayersInstancesSelector = atom((get) =>
  get(fourwingsLayersAtom).map((l) => l.instance)
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

export const useFourwingsLayers = (
  fourwingsLayersGenerator: FourwingsDeckLayerGenerator[],
  globalConfig: globalConfig
) => {
  const { start, end } = globalConfig

  const setFourwingsLayers = useSetAtom(fourwingsLayersAtom)

  const setFourwingsLoadedState = useSetAtom(
    atom(null, (get, set, id: FourwingsLayerState['id']) =>
      set(fourwingsLayersAtom, (prevVessels) => {
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

  const onDataLoad = (data: LayerData<any>, context: { propName: string; layer: Layer<any> }) => {
    console.log(data, context)
    // setFourwingsLoadedState(context.layer.id)
  }

  const startTime = useMemo(() => (start ? dateToMs(start) : undefined), [start])
  console.log('🚀 ~ file: fourwings.hooks.ts:111 ~ start:', start)
  console.log('🚀 ~ file: fourwings.hooks.ts:252 ~ startTime:', startTime)
  const endTime = useMemo(() => (end ? dateToMs(end) : undefined), [end])
  console.log('🚀 ~ file: fourwings.hooks.ts:114 ~ end:', end)
  console.log('🚀 ~ file: fourwings.hooks.ts:254 ~ endTime:', endTime)

  useEffect(() => {
    fourwingsLayersGenerator.forEach(({ id, dataview }) => {
      const instance = new FourwingsLayer({
        minFrame: startTime,
        maxFrame: endTime,
        // mode: activityMode,
        mode: 'heatmap',
        debug: true,
        sublayers: FOURWINGS_SUBLAYERS,
        // onTileLoad: onTileLoad,
        // onViewportLoad: onViewportLoad,
        // onVesselHighlight: onVesselHighlight,
        // onVesselClick: onVesselClick,
        // resolution: fourwingsMapLayerResolution,
        // hoveredFeatures: hoveredFeatures,
        // clickedFeatures: clickedFeatures,
      })

      setFourwingsLayers((prevVessels) => {
        const updatedVessels = prevVessels.filter((v) => v.id !== id)
        updatedVessels.push({
          id,
          instance,
          loadedLayers: [],
        })
        return updatedVessels
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, end, fourwingsLayersGenerator])
  return useAtomValue(fourwingsLayersInstancesSelector)
}
