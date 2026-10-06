import { atom } from 'jotai'

import type { Place } from 'features/_places/places.loaders'

/** List card under the pointer; PlacesMap highlights it. Set on mouse enter, cleared on leave. */
export const hoveredPlaceAtom = atom<Place | undefined>(undefined)
