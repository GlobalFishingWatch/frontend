import { atomFamily, useRecoilState } from 'recoil'

export type ModalId = 'datasetLibrary' | 'new4wingsDataset' | 'newContextDataset'

const modalsStateFamily = atomFamily({
  key: 'ModalsState',
  default: false,
})

export const useModal = (modalId: ModalId) => {
  return useRecoilState(modalsStateFamily(modalId))
}
