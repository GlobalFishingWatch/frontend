import { atom } from 'jotai'

type OverlaysCursor = 'pointer' | 'grab' | 'move' | ''
export const overlaysCursorAtom = atom<OverlaysCursor>('')
