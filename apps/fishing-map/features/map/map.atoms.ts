import type { MapView, ViewStateMap } from '@deck.gl/core'
import type { DeckGLRef } from '@deck.gl/react'
import { atom } from 'jotai'

import type { MiniglobeBounds } from '@globalfishingwatch/ui-components'

import { DEFAULT_VIEWPORT } from 'data/config'
import { getUrlViewstateNumericParam } from 'utils/url'

// MAP INSTANCE
export const mapInstanceAtom = atom<DeckGLRef | undefined>(undefined)

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
export const viewStateAtom = atom<ViewStateMap<MapView>>({
  longitude: getUrlViewstateNumericParam('longitude') || DEFAULT_VIEWPORT.longitude,
  latitude: getUrlViewstateNumericParam('latitude') || DEFAULT_VIEWPORT.latitude,
  zoom: getUrlViewstateNumericParam('zoom') || DEFAULT_VIEWPORT.zoom,
})
