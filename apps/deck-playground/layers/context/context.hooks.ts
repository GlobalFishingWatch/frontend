import { useCallback, useEffect } from 'react'
import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { ContextsLayer } from 'layers/context/ContextsLayer'
import { useMapLayers } from 'features/map/layers.hooks'
import { useMapHoveredFeatures } from 'features/map/map-picking.hooks'

type ContextsAtom = {
  ids: string[]
  loaded: boolean
  // renderReady: boolean
  instance?: ContextsLayer
}

export const contextsLayerAtom = atom<ContextsAtom>({
  key: 'contextsLayer',
  dangerouslyAllowMutability: true,
  default: {
    ids: [],
    loaded: false,
    // renderReady: false,
  },
})

export function useContextsLayer() {
  const [{ instance, ids }, updateAtom] = useRecoilState(contextsLayerAtom)
  const [mapLayers] = useMapLayers()
  // const mapHoveredFeatures = useMapHoveredFeatures()
  // console.log(
  //   '🚀 ~ file: context.hooks.ts:28 ~ useContextsLayer ~ mapHoveredFeatures',
  //   mapHoveredFeatures
  // )

  const layer = mapLayers.find((l) => l.id === 'contexts')
  const layerVisible = layer?.visible

  const setAtomProperty = useCallback(
    (property) => updateAtom((state) => ({ ...state, ...property })),
    [updateAtom]
  )

  const onDataLoad = useCallback(() => {
    setAtomProperty({ loaded: true })
  }, [setAtomProperty])

  // const onBeforeRender = useCallback(() => {
  //   setAtomProperty({ renderReady: true })
  // }, [setAtomProperty])

  useEffect(() => {
    if (layerVisible) {
      const vesselsLayer = new ContextsLayer({
        ids,
        onDataLoad: onDataLoad,
        // onBeforeRender: onBeforeRender,
      })
      setAtomProperty({ instance: vesselsLayer, renderReady: false })
    } else {
      setAtomProperty({ instance: undefined, loaded: false, renderReady: false })
    }
  }, [ids, layerVisible, updateAtom, onDataLoad, setAtomProperty])

  return instance
}

const contextsInstanceAtomSelector = selector({
  key: 'contextsInstanceAtomSelector',
  dangerouslyAllowMutability: true,
  get: ({ get }) => {
    return get(contextsLayerAtom)?.instance
  },
})

export function useContextsLayerInstance() {
  const instance = useRecoilValue(contextsInstanceAtomSelector)
  return instance
}

const contextsLayerIdsAtomSelector = selector({
  key: 'contextsLayerIdsAtomSelector',
  dangerouslyAllowMutability: true,
  get: ({ get }) => {
    return get(contextsLayerAtom)?.ids
  },
})

export function useContextsLayerIds() {
  const instance = useRecoilValue(contextsLayerIdsAtomSelector)
  return instance
}

export function useAddContextInLayer() {
  const setContextLayer = useSetRecoilState(contextsLayerAtom)
  const addContextLayer = useCallback(
    (id: string) => {
      setContextLayer((atom) => {
        return { ...atom, ids: Array.from(new Set([...atom.ids, id])), loaded: false }
      })
    },
    [setContextLayer]
  )
  return addContextLayer
}

export function useRemoveContextInLayer() {
  const setContextLayer = useSetRecoilState(contextsLayerAtom)
  const addContextLayer = useCallback(
    (id: string) => {
      setContextLayer((atom) => {
        return { ...atom, ids: atom.ids.filter((i) => i !== id) }
      })
    },
    [setContextLayer]
  )
  return addContextLayer
}
