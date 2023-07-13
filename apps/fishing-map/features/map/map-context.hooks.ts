import { useMap as useMapboxMap } from 'react-map-gl'
import { useSetAtom, atom, useAtomValue } from 'jotai'
import { selectAtom } from 'jotai/utils'
import { DeckGLRef } from '@deck.gl/react/typed'
import { RefObject, useEffect } from 'react'
import { Deck } from '@deck.gl/core'

export default function useMapInstance() {
  const { map } = useMapboxMap()
  return map?.getMap() as any as maplibregl.Map
}

const mapInstanceAtom = atom<DeckGLRef | undefined>(undefined)
export const mapInstanceAtomSelector = (map: Deck | undefined) => map
export const selectMapInstance = selectAtom(mapInstanceAtom, mapInstanceAtomSelector)

export function useSetMapInstance(mapRef: RefObject<DeckGLRef> | undefined) {
  const setMapInstance = useSetAtom(mapInstanceAtom)
  useEffect(() => {
    if (mapRef?.current?.deck) {
      setMapInstance(mapRef?.current?.deck)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapRef?.current])
}

export function useMap() {
  return useAtomValue(selectMapInstance)
}
