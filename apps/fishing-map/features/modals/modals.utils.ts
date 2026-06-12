import { getSafeElementById } from 'utils/dom'

export const getModalParent = () =>
  (getSafeElementById('app-layout-content') as HTMLElement) ||
  (typeof document !== 'undefined' ? document.body : (null as unknown as HTMLElement))
