import { PickingInfo } from '@deck.gl/core/typed'
import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil'
import { atom as jotaiAtom } from 'jotai'

export const hoveredFeaturesAtom = jotaiAtom<PickingInfo[]>([])
export const clickedFeaturesAtom = jotaiAtom<PickingInfo[]>([])
export const mapHoveredFeaturesAtom = atom<PickingInfo[]>({
  key: 'hoveredFeatures',
  dangerouslyAllowMutability: true,
  default: [],
  //   effects: [urlSyncEffect({ refine: mixed(), history: 'replace' })],
})

const mapHoveredFeatures = selector({
  key: 'mapHoveredFeatures',
  get: ({ get }) => {
    const features = get(mapHoveredFeaturesAtom)
    return features
  },
})

export function useAddMapHoveredFeatures() {
  const setHoveredFeatures = useSetRecoilState(mapHoveredFeaturesAtom)
  const addHoveredFeatures = (features: PickingInfo[]) => {
    setHoveredFeatures(features)
  }
  return addHoveredFeatures
}

export const useMapHoveredFeatures = () => {
  return useRecoilValue(mapHoveredFeatures)
}
