import { useCallback, useEffect } from 'react'
import { TracksLayer } from 'layers/tracks/TracksLayer'
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil'

import { LineColorBarOptions } from '@globalfishingwatch/ui-components'

export type TrackPoint = {
  coordinates: [number, number]
  timestamp: number
}

export type TrackSublayer = {
  id: string
  active: boolean
  color: string
  data?: TrackPoint[][]
}

type TracksAtom = {
  sublayers: TrackSublayer[]
  loaded: boolean
  instance?: TracksLayer
}

export const tracksLayerAtom = atom<TracksAtom>({
  key: 'tracksLayer',
  dangerouslyAllowMutability: true,
  default: {
    sublayers: [],
    loaded: false,
  },
})

export function useTracksLayer({ token, lastUpdate }) {
  const [atom, updateAtom] = useRecoilState(tracksLayerAtom)

  const setAtomProperty = useCallback(
    (property) => updateAtom((state) => ({ ...state, ...property })),
    [updateAtom]
  )

  const onDataLoad = useCallback(() => {
    setAtomProperty({ loaded: true })
  }, [setAtomProperty])

  const onSublayerLoad = useCallback(
    (id: string, data: any[]) => {
      setAtomProperty({
        sublayers: atom.sublayers.map((sublayer) => {
          if (sublayer.id === id) return { ...sublayer, data }
          return sublayer
        }),
      })
    },
    [atom.sublayers, setAtomProperty]
  )

  useEffect(() => {
    const trackLayer = new TracksLayer({
      sublayers: atom.sublayers,
      token,
      lastUpdate,
      onDataLoad: onDataLoad,
      onSublayerLoad,
    })
    setAtomProperty({ instance: trackLayer })
  }, [updateAtom, onDataLoad, setAtomProperty, token, lastUpdate, onSublayerLoad, atom.sublayers])

  return atom.instance
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

const tracksLayerSublayersAtomSelector = selector({
  key: 'tracksLayerSublayersAtomSelector',
  dangerouslyAllowMutability: true,
  get: ({ get }) => {
    return get(tracksLayerAtom)?.sublayers
  },
})

const tracksLayerLoadedAtomSelector = selector({
  key: 'tracksLayerLoadedAtomSelector',
  dangerouslyAllowMutability: true,
  get: ({ get }) => {
    return get(tracksLayerAtom)?.loaded
  },
})

export function useTracksSublayers() {
  const sublayers = useRecoilValue(tracksLayerSublayersAtomSelector)
  const allLoaded = useRecoilValue(tracksLayerLoadedAtomSelector)
  const [atom, setTrackLayer] = useRecoilState(tracksLayerAtom)

  const toggleTrackSublayer = useCallback(
    (id: string) => {
      setTrackLayer((atom) => {
        return {
          ...atom,
          sublayers: atom.sublayers.map((sublayer) => {
            if (sublayer.id === id) return { ...sublayer, active: !sublayer.active }
            return sublayer
          }),
        }
      })
    },
    [setTrackLayer]
  )

  const removeTrackSublayer = useCallback(
    (id: string) => {
      setTrackLayer((atom) => {
        return { ...atom, sublayers: atom.sublayers.filter((sublayer) => sublayer.id !== id) }
      })
    },
    [setTrackLayer]
  )

  const addTrackSublayer = useCallback(
    (id: string) => {
      const existingSublayer = atom.sublayers.find((sublayer) => sublayer.id === id)
      if (existingSublayer) {
        if (!existingSublayer.active) {
          toggleTrackSublayer(id)
        }
        return
      }
      setTrackLayer((atom) => {
        const sublayers = atom.sublayers || []
        return {
          ...atom,
          sublayers: [
            ...sublayers,
            {
              id,
              active: true,
              color: LineColorBarOptions[sublayers.length % LineColorBarOptions.length].value,
            },
          ],
          loaded: false,
        }
      })
    },
    [atom.sublayers, setTrackLayer, toggleTrackSublayer]
  )

  return {
    allLoaded,
    sublayers,
    addTrackSublayer,
    removeTrackSublayer,
    toggleTrackSublayer,
  }
}
