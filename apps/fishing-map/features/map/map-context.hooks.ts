import { useSetAtom, atom, useAtomValue } from 'jotai'
import { selectAtom } from 'jotai/utils'
import type { DeckGLRef } from '@deck.gl/react'
import type { RefObject } from 'react'
import { useEffect } from 'react'
import type { Deck } from '@deck.gl/core'

const mapInstanceAtom = atom<DeckGLRef | undefined>(undefined)
const mapInstanceAtomSelector = (map: Deck | undefined) => map
const selectMapInstance = selectAtom(mapInstanceAtom, mapInstanceAtomSelector as any)

export function useSetMapInstance(mapRef: RefObject<DeckGLRef> | undefined) {
  const setMapInstance = useSetAtom(mapInstanceAtom)
  useEffect(() => {
    if (mapRef?.current?.deck) {
      setMapInstance(mapRef?.current?.deck)
    }
  }, [mapRef?.current])
}

export function useDeckMap(): Deck {
  return useAtomValue(selectMapInstance) as Deck
}
