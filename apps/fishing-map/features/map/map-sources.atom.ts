import { atom } from 'recoil'

export const mapTilesAtom = atom<Record<string, boolean>>({
  key: 'mapSourceTilesLoaded',
  default: {},
})
