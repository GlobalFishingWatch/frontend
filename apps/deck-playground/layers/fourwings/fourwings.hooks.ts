import { getFourwingsMode } from 'layers/fourwings/fourwings.utils'
import { useCallback, useEffect } from 'react'
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil'
import { useAddVesselInLayer } from 'layers/vessel/vessels.hooks'
import { useTimerange } from 'features/timebar/timebar.hooks'
import { useViewport } from 'features/map/map-viewport.hooks'
import { useMapLayers } from 'features/map/layers.hooks'
import { FourwingsLayer, FourwingsLayerMode } from './FourwingsLayer'
import { FourwingsSublayer } from './fourwings.types'

const dateToMs = (date: string) => {
  return new Date(date).getTime()
}

type FourwingsAtom = {
  highlightedVesselId?: string
  instance?: FourwingsLayer
  loaded: boolean
}

export const fourwingsLayerAtom = atom<FourwingsAtom>({
  key: 'fourwingsLayer',
  dangerouslyAllowMutability: true,
  default: {
    loaded: false,
  },
})

const sublayers: FourwingsSublayer[] = [
  {
    id: 'ais',
    datasets: ['public-global-fishing-effort:v20201001'],
    colorRamp: 'magenta',
  },
  {
    id: 'vms-brazil',
    datasets: ['public-bra-onyxsat-fishing-effort:v20211126'],
    colorRamp: 'sky',
  },
  {
    id: 'vms-chile',
    datasets: ['public-chile-fishing-effort:v20211126'],
    colorRamp: 'green',
  },
  {
    id: 'vms-ecuador',
    datasets: ['public-ecuador-fishing-effort:v20211126'],
    colorRamp: 'orange',
  },
]

export function useFourwingsLayer() {
  const [{ highlightedVesselId, instance }, updateFourwingsAtom] =
    useRecoilState(fourwingsLayerAtom)
  const [mapLayers] = useMapLayers()
  const [timerange] = useTimerange()
  const startTime = dateToMs(timerange.start)
  const endTime = dateToMs(timerange.end)
  const { viewState } = useViewport()
  const activityMode: FourwingsLayerMode = getFourwingsMode(viewState.zoom, timerange)
  const addVesselLayer = useAddVesselInLayer()

  const fourwingsMapLayer = mapLayers.find((l) => l.id === 'fourwings')
  const fourwingsMapLayerVisible = fourwingsMapLayer?.visible
  const fourwingsMapLayerResolution = fourwingsMapLayer?.resolution

  const setAtomProperty = useCallback(
    (property) => updateFourwingsAtom((state) => ({ ...state, ...property })),
    [updateFourwingsAtom]
  )

  const onTileLoad = useCallback(() => {
    setAtomProperty({ loaded: false })
  }, [setAtomProperty])

  const onViewportLoad = useCallback(() => {
    setAtomProperty({ loaded: true })
  }, [setAtomProperty])

  const onVesselHighlight = useCallback(
    (id) => {
      setAtomProperty({ highlightedVesselId: id })
    },
    [setAtomProperty]
  )

  const onVesselClick = useCallback(
    (id) => {
      addVesselLayer(id)
    },
    [addVesselLayer]
  )

  useEffect(() => {
    if (fourwingsMapLayerVisible) {
      const fourwingsLayer = new FourwingsLayer({
        minFrame: startTime,
        maxFrame: endTime,
        mode: activityMode,
        sublayers,
        onTileLoad: onTileLoad,
        onViewportLoad: onViewportLoad,
        highlightedVesselId,
        onVesselHighlight: onVesselHighlight,
        onVesselClick: onVesselClick,
        resolution: fourwingsMapLayerResolution,
      })
      setAtomProperty({ instance: fourwingsLayer })
    } else {
      setAtomProperty({ instance: undefined })
    }
  }, [
    fourwingsMapLayerVisible,
    startTime,
    endTime,
    activityMode,
    highlightedVesselId,
    fourwingsMapLayerResolution,
    onTileLoad,
    onViewportLoad,
    setAtomProperty,
    onVesselHighlight,
    onVesselClick,
  ])

  return instance
}

const fourwingsInstanceAtomSelector = selector({
  key: 'fourwingsInstanceAtomSelector',
  dangerouslyAllowMutability: true,
  get: ({ get }) => {
    return get(fourwingsLayerAtom)?.instance
  },
})
export function useFourwingsLayerInstance() {
  const instance = useRecoilValue(fourwingsInstanceAtomSelector)
  return instance
}

const fourwingsLoadedAtomSelector = selector({
  key: 'fourwingsLoadedAtomSelector',
  dangerouslyAllowMutability: true,
  get: ({ get }) => {
    return get(fourwingsLayerAtom)?.loaded
  },
})

export function useFourwingsLayerLoaded() {
  const loaded = useRecoilValue(fourwingsLoadedAtomSelector)
  return loaded
}
