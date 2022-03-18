import { atom } from 'recoil'

export const mapIdleAtom = atom<boolean>({
  key: 'mapIdle',
  default: false,
})

export const mapReadyAtom = atom<boolean>({
  key: 'mapReady',
  default: false,
})
