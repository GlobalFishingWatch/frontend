import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback } from 'react'
import type { InteractionEvent } from './types'

export const deckHoverInteractionAtom = atom<InteractionEvent>({} as InteractionEvent)

export const useMapHoverInteraction = () => {
  return useAtomValue(deckHoverInteractionAtom)
}

export const useSetMapHoverInteraction = () => {
  const setDeckInteraction = useSetAtom(deckHoverInteractionAtom)
  return useCallback(setDeckInteraction, [setDeckInteraction])
}
