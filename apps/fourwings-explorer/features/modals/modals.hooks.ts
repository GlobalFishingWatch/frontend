import { atomFamily, useRecoilState, useSetRecoilState } from 'recoil'

export type ModalId = 'datasetLibrary' | 'newFourwingsDataset' | 'newContextDataset'

const modalsStateFamily = atomFamily({
  key: 'ModalsState',
  default: false,
})

export const useModal = (modalId: ModalId) => {
  return useRecoilState(modalsStateFamily(modalId))
}

export const useSetModal = (modalId: ModalId) => {
  return useSetRecoilState(modalsStateFamily(modalId))
}
