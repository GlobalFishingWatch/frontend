import { vi } from 'vitest'
import { userEvent } from 'vitest/browser'

import type { render } from '../appTestUtils'

type GetByTestId = Awaited<ReturnType<typeof render>>['getByTestId']

/**
 * Clicks a layer row action (remove, info, filters…).
 *
 * The actions only show while the row is hovered (`hideUntilHovered`), and the sidebar reflows as
 * layer legends finish loading. A row below an activity layer can therefore move out from under
 * the pointer between a hover and the click, leaving the button hidden. Hovering and clicking in
 * one retried step makes the click land once the layout has settled.
 */
export async function clickLayerAction(
  getByTestId: GetByTestId,
  { row, action }: { row: string | RegExp; action: string | RegExp },
  timeout = 10000
) {
  await vi.waitFor(
    async () => {
      await userEvent.hover(getByTestId(row))
      await userEvent.click(getByTestId(action), { timeout: 1000 })
    },
    { timeout, interval: 250 }
  )
}
