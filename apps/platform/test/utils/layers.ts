import { vi } from 'vitest'

import type { render } from '../appTestUtils'

type GetByTestId = Awaited<ReturnType<typeof render>>['getByTestId']

/**
 * Clicks a layer row action (remove, info, filters, edit…).
 *
 * WHY a DOM click and not `userEvent.click`: the actions only show while the row is hovered
 * (`hideUntilHovered`), and they slide in by animating their width with overlapping negative
 * margins, so a neighbouring action can sit on top of the target for part of the transition. The
 * sidebar also reflows as layer legends load. Playwright's hit-target check then reports the click
 * as intercepted and times out, even when the app already handled it (the edit action opened the
 * polygon editor and the click still failed). Retrying is no fix either: these actions are not
 * idempotent. Which action is shown on hover is CSS only, so a DOM click on the rendered button is
 * what a user's click does.
 */
export async function clickLayerAction(
  getByTestId: GetByTestId,
  { row, action }: { row: string | RegExp; action: string | RegExp },
  timeout = 10000
) {
  const button = await vi.waitFor(
    () => {
      getByTestId(row).element()
      return getByTestId(action).element() as HTMLElement
    },
    { timeout, interval: 250 }
  )
  button.click()
}
