import { atom, useAtomValue, useSetAtom } from 'jotai'
import { atomEffect } from 'jotai-effect'
import { useCallback } from 'react'
import { ContextPickingInfo, FourwingsPickingInfo } from '@globalfishingwatch/deck-layers'

// Atom used to have all the layer instances loading state available
export type DeckLayerInteraction = {
  latitude: number
  longitude: number
  features: (FourwingsPickingInfo | ContextPickingInfo)[]
}

export const deckHoverInteractionAtom = atom<DeckLayerInteraction>({} as DeckLayerInteraction)
export const basedeckClickInteractionAtom = atom<DeckLayerInteraction>({} as DeckLayerInteraction)
export const deckClickInteractionAtom = atom<DeckLayerInteraction>({} as DeckLayerInteraction)

export async function fetchData(url: string, signal: AbortSignal) {
  const res = await fetch(url, { signal })
  if (signal.aborted) return
  const data = await res.json()
  if (signal.aborted) return
  return data
}

let index = 1
const interactionClickEffect = atomEffect((get, set) => {
  const interactionAtom = get(basedeckClickInteractionAtom)
  const controller = new AbortController()
  ;(async () => {
    const fourwingsFeatures = interactionAtom.features?.filter(
      (f) => f.object?.category === 'activity'
    )
    console.log('🚀 ~ interactionClickEffect ~ interactionAtom.features:', interactionAtom.features)
    if (fourwingsFeatures?.length) {
      const cellId = fourwingsFeatures[0].object?.properties.cellId
      console.log('🚀 ~ ; ~ cellId:', cellId)
      const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${index++}`, {
        signal: controller.signal,
      })
      if (controller.signal.aborted) return
      console.log('🚀 ~ ; ~ res:', res)
      const data = await res.json()
      if (controller.signal.aborted) return
      set(deckClickInteractionAtom, { ...interactionAtom, cellId, data: data })
    }
  })()
  return () => {
    console.log('aborting')
    controller.abort()
  }
})

export const useMapHoverInteraction = () => {
  return useAtomValue(deckHoverInteractionAtom)
}
export const useMapClickInteraction = () => {
  return useAtomValue(deckClickInteractionAtom)
}

export const useSetMapHoverInteraction = () => {
  const setDeckInteraction = useSetAtom(deckHoverInteractionAtom)
  return useCallback(setDeckInteraction, [setDeckInteraction])
}

export const useSetMapClickInteraction = () => {
  const setDeckInteraction = useSetAtom(basedeckClickInteractionAtom)
  useAtomValue(interactionClickEffect)
  return useCallback(setDeckInteraction, [setDeckInteraction])
}
