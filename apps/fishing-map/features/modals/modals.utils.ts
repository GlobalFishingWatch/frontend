import { getIsBrowser, getSafeElementById } from 'utils/dom'

export const getModalParent = () =>
  (getSafeElementById('app-layout-content') as HTMLElement) ||
  (getIsBrowser() ? document.body : (null as unknown as HTMLElement))
