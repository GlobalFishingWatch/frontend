import { atom, useRecoilState } from 'recoil'

export const datasetLibraryModalAtom = atom<boolean>({
  key: 'datasetLibraryModal',
  default: false,
})

export const useDatasetsLibraryModal = () => {
  return useRecoilState(datasetLibraryModalAtom)
}
