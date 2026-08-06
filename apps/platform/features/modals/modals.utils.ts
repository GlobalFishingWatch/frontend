import { PLATFORM_CONTAINER_DOM_ID } from 'data/map/config'
import { getIsBrowser, getSafeElementById } from 'utils/dom'

export const getModalParent = () =>
  (getSafeElementById(PLATFORM_CONTAINER_DOM_ID) as HTMLElement) ||
  (getIsBrowser() ? document.body : (null as unknown as HTMLElement))
