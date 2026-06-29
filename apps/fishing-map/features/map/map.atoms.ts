import type { Deck, MapView, ViewStateMap } from '@deck.gl/core'
import { atom } from 'jotai'

import type { MiniglobeBounds } from '@globalfishingwatch/ui-components'

import { DEFAULT_VIEWPORT } from 'data/config'

// MAP INSTANCE
export const mapInstanceAtom = atom<Deck<MapView> | undefined>(undefined)

// BOUNDS
type BoundsAtom = MiniglobeBounds & { isTransitioning?: boolean }
export const boundsAtom = atom<BoundsAtom>({
  north: 90,
  south: -90,
  west: -180,
  east: 180,
  isTransitioning: false,
})

// VIEW STATE
// Keep the initial value deterministic (same on server and client) to avoid SSR
// hydration mismatches. The viewport from the URL is synced into the atom on the
// client after mount via useMapViewStateUrlSync.
export const viewStateAtom = atom<ViewStateMap<MapView>>({
  longitude: DEFAULT_VIEWPORT.longitude,
  latitude: DEFAULT_VIEWPORT.latitude,
  zoom: DEFAULT_VIEWPORT.zoom,
})
