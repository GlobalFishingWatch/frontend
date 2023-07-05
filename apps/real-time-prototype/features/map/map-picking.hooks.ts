import { PickingInfo } from '@deck.gl/core/typed'
import { atom as jotaiAtom } from 'jotai'

export const hoveredFeaturesAtom = jotaiAtom<PickingInfo[]>([])
export const clickedFeaturesAtom = jotaiAtom<PickingInfo[]>([])
