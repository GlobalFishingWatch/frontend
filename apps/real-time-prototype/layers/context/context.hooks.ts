import { useCallback, useEffect } from 'react'
import type { PickingInfo } from '@deck.gl/core'
import { useAtomValue } from 'jotai'
import { ContextsLayer } from 'layers/context/ContextsLayer'
import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import { clickedFeaturesAtom,hoveredFeaturesAtom } from 'features/map/map-picking.hooks'

type ContextsAtom = {
  ids: string[]
  loaded: boolean
  instance?: ContextsLayer
}

export const contextsLayerAtom = atom<ContextsAtom>({
  key: 'contextsLayer',
  dangerouslyAllowMutability: true,
  default: {
    ids: [],
    loaded: false,
  },
})

export function useContextsLayer() {
  const [{ instance, ids }, updateAtom] = useRecoilState(contextsLayerAtom)
  const hoveredFeatures: PickingInfo[] = useAtomValue(hoveredFeaturesAtom)
  const clickedFeatures: PickingInfo[] = useAtomValue(clickedFeaturesAtom)

  const setAtomProperty = useCallback(
    (property) => updateAtom((state) => ({ ...state, ...property })),
    [updateAtom]
  )

  const onDataLoad = useCallback(() => {
    setAtomProperty({ loaded: true })
  }, [setAtomProperty])

  useEffect(() => {
    const contextLayer = new ContextsLayer({
      ids,
      hoveredFeatures,
      clickedFeatures,
      onDataLoad: onDataLoad,
    })
    setAtomProperty({ instance: contextLayer })
  }, [ids, updateAtom, onDataLoad, setAtomProperty, hoveredFeatures, clickedFeatures])

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
