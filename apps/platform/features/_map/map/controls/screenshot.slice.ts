import type { PayloadAction, WithSlice } from '@reduxjs/toolkit'
import { createSelector, createSlice } from '@reduxjs/toolkit'

import { MAIN_DOM_ID, SPLIT_VIEW_DOM_ID } from '@globalfishingwatch/ui-components'

import { selectUserSettings } from 'features/_user/selectors/user.selectors'
import { rootReducer } from 'reducers'
import { selectIsWorkspaceLocation } from 'router/routes.selectors'

import { MAP_CONTAINER_ID } from '../map-viewport.hooks'

export type ScrenshotArea = 'map' | 'withTimebar' | 'withTimebarAndLegend'
export type ScrenshotDOMArea =
  typeof SPLIT_VIEW_DOM_ID | typeof MAP_CONTAINER_ID | typeof MAIN_DOM_ID

export const ScrenshotAreaIds: Record<ScrenshotArea, ScrenshotDOMArea> = {
  map: MAP_CONTAINER_ID,
  withTimebar: MAIN_DOM_ID,
  withTimebarAndLegend: SPLIT_VIEW_DOM_ID,
}

export type ScreenshotAspectRatio = 'current' | '2:1' | '16:9' | '3:2' | '1:1' | '2:3' | '9:16'

// width / height; null keeps the capture area at whatever size the window gives it
export const SCREENSHOT_ASPECT_RATIOS: Record<ScreenshotAspectRatio, number | null> = {
  current: null,
  '2:1': 2,
  '16:9': 16 / 9,
  '3:2': 3 / 2,
  '1:1': 1,
  '2:3': 2 / 3,
  '9:16': 9 / 16,
}

const DEFAULT_SCREENSHOT_AREA = ScrenshotAreaIds.map
const DEFAULT_SCREENSHOT_ASPECT_RATIO: ScreenshotAspectRatio = 'current'

interface ScreenshotState {
  labelSizeScale: number
}

export const screenshotSlice = createSlice({
  name: 'screenshot',
  initialState: { labelSizeScale: 1 } as ScreenshotState,
  reducers: {
    setLabelSizeScale: (state, action: PayloadAction<number>) => {
      state.labelSizeScale = action.payload
    },
  },
})

export const { setLabelSizeScale } = screenshotSlice.actions

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

export const selectScreenshotAreaId = createSelector(
  [selectUserSettings, selectIsWorkspaceLocation],
  (settings, isWorkspaceLocation): ScrenshotDOMArea => {
    const areaId = settings.mapScreenshot?.areaId
    const area =
      Object.values(ScrenshotAreaIds).find((id) => id === areaId) ?? DEFAULT_SCREENSHOT_AREA
    return !isWorkspaceLocation && area === ScrenshotAreaIds.withTimebarAndLegend
      ? ScrenshotAreaIds.withTimebar
      : area
  }
)

export const selectScreenshotAspectRatio = createSelector(
  [selectUserSettings],
  (settings): ScreenshotAspectRatio => {
    const aspectRatio = settings.mapScreenshot?.aspectRatio
    return aspectRatio && Object.hasOwn(SCREENSHOT_ASPECT_RATIOS, aspectRatio)
      ? (aspectRatio as ScreenshotAspectRatio)
      : DEFAULT_SCREENSHOT_ASPECT_RATIO
  }
)

export const selectLabelSizeScale = injectedScreenshotSlice.selector(
  (state) => state.screenshot.labelSizeScale
)

export default screenshotSlice.reducer
