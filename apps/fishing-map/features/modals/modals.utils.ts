import { getSafeElementById } from 'utils/dom'

export const getModalParent = () => getSafeElementById('app-layout-content') as HTMLElement
