import { FourwingsColorRamp } from 'layers/fourwings/FourwingsLayer'
import { useCallback, useEffect } from 'react'
import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { VesselsLayer } from 'layers/vessel/VesselsLayer'
import { useMapLayers } from 'features/map/layers.hooks'
import { useHighlightTimerange, useTimerange } from 'features/timebar/timebar.hooks'

const dateToMs = (date: string) => {
  return new Date(date).getTime()
}

type VesselsAtom = {
  loaded: boolean
  ids: string[]
  instance?: VesselsLayer
}

export const vesselsLayerAtom = atom<VesselsAtom>({
  key: 'vesselsLayer',
  dangerouslyAllowMutability: true,
  default: {
    loaded: false,
    ids: [],
  },
})

export function useVesselsLayer() {
  const [{ instance, ids }, updateAtom] = useRecoilState(vesselsLayerAtom)
  const [mapLayers] = useMapLayers()
  const [timerange] = useTimerange()
  const [highlightTimerange] = useHighlightTimerange()
  const startTime = dateToMs(timerange.start)
  const endTime = dateToMs(timerange.end)
  const highlightStartTime = dateToMs(highlightTimerange?.start)
  const highlightEndTime = dateToMs(highlightTimerange?.end)

  const layer = mapLayers.find((l) => l.id === 'vessel')
  const layerVisible = layer?.visible

  const setAtomProperty = useCallback(
    (property) => updateAtom((state) => ({ ...state, ...property })),
    [updateAtom]
  )

  const onVesselHighlight = useCallback(
    (id) => {
      setAtomProperty({ highlightedVesselId: id })
    },
    [setAtomProperty]
  )

  const onDataLoad = useCallback(() => {
    setAtomProperty({ loaded: true })
  }, [setAtomProperty])

  const onColorRampUpdate = useCallback(
    (colorRamp: FourwingsColorRamp) => {
      if (colorRamp) {
        setAtomProperty({ colorRamp })
      }
    },
    [setAtomProperty]
  )

  useEffect(() => {
    if (layerVisible) {
      const vesselsLayer = new VesselsLayer({
        ids,
        startTime,
        endTime,
        highlightStartTime,
        highlightEndTime,
        onDataLoad: onDataLoad,
      })
      setAtomProperty({ instance: vesselsLayer })
    } else {
      setAtomProperty({ instance: undefined, loaded: false })
    }
  }, [
    startTime,
    endTime,
    updateAtom,
    onColorRampUpdate,
    setAtomProperty,
    onVesselHighlight,
    layerVisible,
    ids,
    highlightStartTime,
    highlightEndTime,
    onDataLoad,
  ])

  return instance
}

const vesselsInstanceAtomSelector = selector({
  key: 'vesselsInstanceAtomSelector',
  dangerouslyAllowMutability: true,
  get: ({ get }) => {
    return get(vesselsLayerAtom)?.instance
  },
})

export function useVesselsLayerInstance() {
  const instance = useRecoilValue(vesselsInstanceAtomSelector)
  return instance
}

const vesselsLayerIdsAtomSelector = selector({
  key: 'vesselsLayerIdsInstanceAtomSelector',
  dangerouslyAllowMutability: true,
  get: ({ get }) => {
    return get(vesselsLayerAtom)?.ids
  },
})

export function useVesselsLayerIds() {
  const instance = useRecoilValue(vesselsLayerIdsAtomSelector)
  return instance
}

const vesselsLayerLoadedAtomSelector = selector({
  key: 'vesselsLayerLoadedAtomSelector',
  dangerouslyAllowMutability: true,
  get: ({ get }) => {
    return get(vesselsLayerAtom)?.loaded
  },
})

export function useVesselsLayerLoaded() {
  const loaded = useRecoilValue(vesselsLayerLoadedAtomSelector)
  return loaded
}

export function useAddVesselInLayer() {
  const setVesselLayer = useSetRecoilState(vesselsLayerAtom)
  const addVesselLayer = useCallback(
    (id: string) => {
      setVesselLayer((atom) => {
        return { ...atom, ids: Array.from(new Set([...atom.ids, id])), loaded: false }
      })
    },
    [setVesselLayer]
  )
  return addVesselLayer
}

export function useRemoveVesselInLayer() {
  const setVesselLayer = useSetRecoilState(vesselsLayerAtom)
  const addVesselLayer = useCallback(
    (id: string) => {
      setVesselLayer((atom) => {
        return { ...atom, ids: atom.ids.filter((i) => i !== id) }
      })
    },
    [setVesselLayer]
  )
  return addVesselLayer
}
