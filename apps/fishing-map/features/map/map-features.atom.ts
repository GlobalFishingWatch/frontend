import { atom } from 'recoil'

export const mapIdleAtom = atom<boolean>({
  key: 'mapIdle',
  default: false,
})
