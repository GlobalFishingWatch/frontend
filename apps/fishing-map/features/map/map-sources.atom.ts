import { atom } from 'recoil'

export type TilesAtomSourceState = {
  loaded: boolean
  error?: string
}
export const mapTilesAtom = atom<Record<string, TilesAtomSourceState>>({
  key: 'mapSourceTilesState',
  default: {},
})
