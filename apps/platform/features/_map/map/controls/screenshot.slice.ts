import type { PayloadAction, WithSlice } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import { MAIN_DOM_ID, SPLIT_VIEW_DOM_ID } from '@globalfishingwatch/ui-components'

import { rootReducer } from 'reducers'
import { getIsBrowser } from 'utils/dom'

import { MAP_CONTAINER_ID } from '../map-viewport.hooks'

export type ScrenshotArea = 'map' | 'withTimebar' | 'withTimebarAndLegend'
export type ScrenshotDOMArea =
  typeof SPLIT_VIEW_DOM_ID | typeof MAP_CONTAINER_ID | typeof MAIN_DOM_ID

export const ScrenshotAreaIds: Record<ScrenshotArea, ScrenshotDOMArea> = {
  map: MAP_CONTAINER_ID,
  withTimebar: MAIN_DOM_ID,
  withTimebarAndLegend: SPLIT_VIEW_DOM_ID,
}

const DEFAULT_SCREENSHOT_AREA = ScrenshotAreaIds.withTimebarAndLegend
const SCREENSHOT_AREA_KEY_ID = 'screenShotAreaId'

interface ScreenshotState {
  screenshotAreaId: ScrenshotDOMArea
}

const getInitialState = (): ScreenshotState => {
  if (!getIsBrowser()) return { screenshotAreaId: DEFAULT_SCREENSHOT_AREA }

  const storedValue = localStorage.getItem(SCREENSHOT_AREA_KEY_ID)
  if (!storedValue) return { screenshotAreaId: DEFAULT_SCREENSHOT_AREA }

  try {
    const parsedValue = JSON.parse(storedValue) as ScrenshotDOMArea
    return { screenshotAreaId: parsedValue }
  } catch {
    return { screenshotAreaId: DEFAULT_SCREENSHOT_AREA }
  }
}

export const screenshotSlice = createSlice({
  name: 'screenshot',
  initialState: getInitialState(),
  reducers: {
    setScreenshotAreaId: (state, action: PayloadAction<ScrenshotDOMArea>) => {
      state.screenshotAreaId = action.payload
      if (getIsBrowser()) {
        localStorage.setItem(SCREENSHOT_AREA_KEY_ID, JSON.stringify(action.payload))
      }
    },
  },
})

export const { setScreenshotAreaId } = screenshotSlice.actions

/**
 * Lazily registered: this slice is only reachable from features/_map/map/Map.tsx, which lives in the map
 * shell, so pages without a map should not pay for it. Importing this module performs the injection —
 * that is the point, the chunk that needs the slice is the chunk that registers it.
 *
 */
const injectedScreenshotSlice = rootReducer.inject(screenshotSlice)

declare module 'reducers' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface LazyLoadedSlices extends WithSlice<typeof screenshotSlice> {}
}

export const selectScreenshotAreaId = injectedScreenshotSlice.selector(
  (state) => state.screenshot.screenshotAreaId
)

export default screenshotSlice.reducer
