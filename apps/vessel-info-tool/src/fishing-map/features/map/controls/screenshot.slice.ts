import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from 'reducers'

import { MAIN_DOM_ID } from '@globalfishingwatch/ui-components'

import { ROOT_DOM_ELEMENT } from 'data/config'

import { MAP_CONTAINER_ID } from '../map-viewport.hooks'

export type ScrenshotArea = 'map' | 'withTimebar' | 'withTimebarAndLegend'
export type ScrenshotDOMArea =
  | typeof ROOT_DOM_ELEMENT
  | typeof MAP_CONTAINER_ID
  | typeof MAIN_DOM_ID

export const ScrenshotAreaIds: Record<ScrenshotArea, ScrenshotDOMArea> = {
  map: MAP_CONTAINER_ID,
  withTimebar: MAIN_DOM_ID,
  withTimebarAndLegend: ROOT_DOM_ELEMENT,
}

const DEFAULT_SCREENSHOT_AREA = ScrenshotAreaIds.withTimebarAndLegend
const SCREENSHOT_AREA_KEY_ID = 'screenShotAreaId'

interface ScreenshotState {
  screenshotAreaId: ScrenshotDOMArea
}

const getInitialState = (): ScreenshotState => {
  if (typeof window === 'undefined') return { screenshotAreaId: DEFAULT_SCREENSHOT_AREA }

  const storedValue = localStorage.getItem(SCREENSHOT_AREA_KEY_ID)
  if (!storedValue) return { screenshotAreaId: DEFAULT_SCREENSHOT_AREA }

  try {
    const parsedValue = JSON.parse(storedValue) as ScrenshotDOMArea
    return { screenshotAreaId: parsedValue }
  } catch {
    return { screenshotAreaId: DEFAULT_SCREENSHOT_AREA }
  }
}

const screenshotSlice = createSlice({
  name: 'screenshot',
  initialState: getInitialState(),
  reducers: {
    setScreenshotAreaId: (state, action: PayloadAction<ScrenshotDOMArea>) => {
      state.screenshotAreaId = action.payload
      if (typeof window !== 'undefined') {
        localStorage.setItem(SCREENSHOT_AREA_KEY_ID, JSON.stringify(action.payload))
      }
    },
  },
})

export const { setScreenshotAreaId } = screenshotSlice.actions

export const selectScreenshotAreaId = (state: RootState) => state.screenshot.screenshotAreaId

export default screenshotSlice.reducer
