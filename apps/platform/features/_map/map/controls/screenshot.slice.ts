import type { PayloadAction, WithSlice } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import { MAIN_DOM_ID, SPLIT_VIEW_DOM_ID } from '@globalfishingwatch/ui-components'

import { rootReducer } from 'reducers'
import { getLocalStorageItem, setLocalStorageItem } from 'utils/dom'

import { MAP_CONTAINER_ID } from '../map-viewport.hooks'

export type ScrenshotArea = 'map' | 'withTimebar' | 'withTimebarAndLegend'
export type ScrenshotDOMArea =
  typeof SPLIT_VIEW_DOM_ID | typeof MAP_CONTAINER_ID | typeof MAIN_DOM_ID

export const ScrenshotAreaIds: Record<ScrenshotArea, ScrenshotDOMArea> = {
  map: MAP_CONTAINER_ID,
  withTimebar: MAIN_DOM_ID,
  withTimebarAndLegend: SPLIT_VIEW_DOM_ID,
}

export type ScreenshotAspectRatio = 'current' | '4:3' | '9:16'

// width / height; null keeps the capture area at whatever size the window gives it
export const SCREENSHOT_ASPECT_RATIOS: Record<ScreenshotAspectRatio, number | null> = {
  current: null,
  '4:3': 4 / 3,
  '9:16': 9 / 16,
}

const DEFAULT_SCREENSHOT_AREA = ScrenshotAreaIds.withTimebarAndLegend
const DEFAULT_SCREENSHOT_ASPECT_RATIO: ScreenshotAspectRatio = 'current'
const SCREENSHOT_AREA_KEY_ID = 'screenShotAreaId'
const SCREENSHOT_ASPECT_RATIO_KEY_ID = 'screenShotAspectRatio'

interface ScreenshotState {
  screenshotAreaId: ScrenshotDOMArea
  screenshotAspectRatio: ScreenshotAspectRatio
  labelSizeScale: number
}

const getInitialAreaId = (): ScrenshotDOMArea => {
  const storedValue = getLocalStorageItem(SCREENSHOT_AREA_KEY_ID)
  if (!storedValue) return DEFAULT_SCREENSHOT_AREA

  try {
    return JSON.parse(storedValue) as ScrenshotDOMArea
  } catch {
    return DEFAULT_SCREENSHOT_AREA
  }
}

const getInitialAspectRatio = (): ScreenshotAspectRatio => {
  const storedValue = getLocalStorageItem(SCREENSHOT_ASPECT_RATIO_KEY_ID)
  return storedValue && Object.hasOwn(SCREENSHOT_ASPECT_RATIOS, storedValue)
    ? (storedValue as ScreenshotAspectRatio)
    : DEFAULT_SCREENSHOT_ASPECT_RATIO
}

const getInitialState = (): ScreenshotState => ({
  screenshotAreaId: getInitialAreaId(),
  screenshotAspectRatio: getInitialAspectRatio(),
  labelSizeScale: 1,
})

export const screenshotSlice = createSlice({
  name: 'screenshot',
  initialState: getInitialState(),
  reducers: {
    setScreenshotAreaId: (state, action: PayloadAction<ScrenshotDOMArea>) => {
      state.screenshotAreaId = action.payload
      setLocalStorageItem(SCREENSHOT_AREA_KEY_ID, JSON.stringify(action.payload))
    },
    setScreenshotAspectRatio: (state, action: PayloadAction<ScreenshotAspectRatio>) => {
      state.screenshotAspectRatio = action.payload
      setLocalStorageItem(SCREENSHOT_ASPECT_RATIO_KEY_ID, action.payload)
    },
    setLabelSizeScale: (state, action: PayloadAction<number>) => {
      state.labelSizeScale = action.payload
    },
  },
})

export const { setScreenshotAreaId, setScreenshotAspectRatio, setLabelSizeScale } =
  screenshotSlice.actions

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

export const selectScreenshotAspectRatio = injectedScreenshotSlice.selector(
  (state) => state.screenshot.screenshotAspectRatio
)

export const selectLabelSizeScale = injectedScreenshotSlice.selector(
  (state) => state.screenshot.labelSizeScale
)

export default screenshotSlice.reducer
