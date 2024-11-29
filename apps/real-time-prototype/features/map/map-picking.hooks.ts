import type { PickingInfo } from '@deck.gl/core'
import { atom as jotaiAtom } from 'jotai'

export const hoveredFeaturesAtom = jotaiAtom<PickingInfo[]>([])
export const clickedFeaturesAtom = jotaiAtom<PickingInfo[]>([])
