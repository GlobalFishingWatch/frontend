import { useCallback, useEffect } from 'react'
import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { TracksLayer } from 'layers/tracks/TracksLayer'
import { useMapLayers } from 'features/map/layers.hooks'

type TracksAtom = {
  ids: string[]
  loaded: boolean
  instance?: TracksLayer
}

export const tracksLayerAtom = atom<TracksAtom>({
  key: 'tracksLayer',
  dangerouslyAllowMutability: true,
  default: {
    ids: [],
    loaded: false,
  },
})

export function useTracksLayer({ token, lastUpdate }) {
  const [{ instance, ids }, updateAtom] = useRecoilState(tracksLayerAtom)
  const [mapLayers] = useMapLayers()

  const layer = mapLayers.find((l) => l.id === 'tracks')
  const layerVisible = layer?.visible

  const setAtomProperty = useCallback(
    (property) => updateAtom((state) => ({ ...state, ...property })),
    [updateAtom]
  )

  const onDataLoad = useCallback(() => {
    setAtomProperty({ loaded: true })
  }, [setAtomProperty])

  useEffect(() => {
    if (layerVisible) {
      const trackLayer = new TracksLayer({
        ids,
        token,
        lastUpdate,
        onDataLoad: onDataLoad,
      })
      setAtomProperty({ instance: trackLayer })
    } else {
      setAtomProperty({ instance: undefined, loaded: false })
    }
  }, [ids, layerVisible, updateAtom, onDataLoad, setAtomProperty, token, lastUpdate])

  return instance
}

const tracksInstanceAtomSelector = selector({
  key: 'tracksInstanceAtomSelector',
  dangerouslyAllowMutability: true,
  get: ({ get }) => {
    return get(tracksLayerAtom)?.instance
  },
})

export function useTracksLayerInstance() {
  const instance = useRecoilValue(tracksInstanceAtomSelector)
  return instance
}

const tracksLayerIdsAtomSelector = selector({
  key: 'tracksLayerIdsAtomSelector',
  dangerouslyAllowMutability: true,
  get: ({ get }) => {
    return get(tracksLayerAtom)?.ids
  },
})

export function useTracksLayerIds() {
  const instance = useRecoilValue(tracksLayerIdsAtomSelector)
  return instance
}

export function useAddTrackInLayer() {
  const setTrackLayer = useSetRecoilState(tracksLayerAtom)
  const addTrackLayer = useCallback(
    (id: string) => {
      setTrackLayer((atom) => {
        return { ...atom, ids: Array.from(new Set([...atom.ids, id])), loaded: false }
      })
    },
    [setTrackLayer]
  )
  return addTrackLayer
}

export function useRemoveTrackInLayer() {
  const setTrackLayer = useSetRecoilState(tracksLayerAtom)
  const addTrackLayer = useCallback(
    (id: string) => {
      setTrackLayer((atom) => {
        return { ...atom, ids: atom.ids.filter((i) => i !== id) }
      })
    },
    [setTrackLayer]
  )
  return addTrackLayer
}
