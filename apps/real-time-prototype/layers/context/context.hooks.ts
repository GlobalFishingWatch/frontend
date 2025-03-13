import { useCallback, useEffect } from 'react'
import type { PickingInfo } from '@deck.gl/core'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { ContextsLayer } from 'layers/context/ContextsLayer'

import { clickedFeaturesAtom, hoveredFeaturesAtom } from 'features/map/map-picking.hooks'

type ContextsAtom = {
  ids: string[]
  loaded: boolean
  instance?: ContextsLayer
}

export const contextsLayerAtom = atom<ContextsAtom>({
  ids: [],
  loaded: false,
})

export function useContextsLayer() {
  const [{ instance, ids }, updateAtom] = useAtom(contextsLayerAtom)
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

export function useContextsLayerInstance() {
  const instance = useAtomValue(contextsLayerAtom).instance
  return instance
}

export function useContextsLayerIds() {
  const instance = useAtomValue(contextsLayerAtom).ids
  return instance
}

export function useAddContextInLayer() {
  const setContextLayer = useSetAtom(contextsLayerAtom)
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
  const setContextLayer = useSetAtom(contextsLayerAtom)
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
