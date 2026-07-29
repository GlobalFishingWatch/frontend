import { SPLIT_VIEW_DOM_ID } from '@globalfishingwatch/ui-components'

import { getIsBrowser, getSafeElementById } from 'utils/dom'

export const getModalParent = () =>
  (getSafeElementById(SPLIT_VIEW_DOM_ID) as HTMLElement) ||
  (getIsBrowser() ? document.body : (null as unknown as HTMLElement))
