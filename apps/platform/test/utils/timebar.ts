import { expect } from 'vitest'
import { page } from 'vitest/browser'

import { timerangeState } from 'features/_map/timebar/timerange.hooks'

import type { JotaiStore, render } from '../appTestUtils'

import { DATA_DAY } from './network/tiles'

type GetByTestId = Awaited<ReturnType<typeof render>>['getByTestId']

// Matches the `title` of the two timebar range handles (libs/timebar timeline-handler.tsx)
const RANGE_HANDLE_TITLE = 'Drag to change the time range'

/**
 * The x of `timestamp` on the timebar, relative to `timebar-wrapper` — the reference that
 * `userEvent.hover(getByTestId('timebar-wrapper'), { position })` expects.
 *
 * The timeline maps the visible range linearly between its two range handles, and each handle is
 * centred on its boundary (`left: x; transform: translateX(-50%)`), so the handles' centres are the
 * pixels of the range's start and end.
 */
export async function getTimebarX(
  getByTestId: GetByTestId,
  jotaiStore: JotaiStore,
  timestamp: number
) {
  const handles = page.getByTitle(RANGE_HANDLE_TITLE, { exact: true })
  await expect.poll(() => handles.elements().length).toBe(2)
  const [startHandle, endHandle] = handles
    .elements()
    .map((element) => element.getBoundingClientRect())
    .map((rect) => rect.left + rect.width / 2)
    .sort((a, b) => a - b)

  const { start, end } = jotaiStore.get(timerangeState)
  const startMs = Date.parse(start)
  const endMs = Date.parse(end)
  if (timestamp < startMs || timestamp > endMs) {
    throw new Error(`${new Date(timestamp).toISOString()} is outside the visible time range`)
  }

  const wrapperLeft = getByTestId('timebar-wrapper').element().getBoundingClientRect().left
  return (
    startHandle +
    ((timestamp - startMs) / (endMs - startMs)) * (endHandle - startHandle) -
    wrapperLeft
  )
}

/**
 * Where the synthetic heatmap tiles hold their data (test/utils/network/tiles.ts). Hover or drag
 * the timebar here instead of at a fixed pixel, which lands on a day with no data.
 */
export const getDataDayTimebarX = (getByTestId: GetByTestId, jotaiStore: JotaiStore) =>
  getTimebarX(getByTestId, jotaiStore, DATA_DAY)
