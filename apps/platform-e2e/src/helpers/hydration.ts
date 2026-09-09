import type { Page } from 'playwright/test'

const SIDEBAR_CONTAINER = '[data-testid="sidebar-container"]'

// Resolves once React has hydrated the given node on the client. The app is server-rendered, so
// markup (and getByTestId locators) are visible before the client takes over. React 18 tags a
// DOM node with internal __reactFiber$/__reactProps$ keys only when its fiber commits during
// hydration, so their presence is a reliable hydration signal.
//
// This matters for the cross-tab tests: each tab registers its BroadcastChannel listener in a
// hydration effect, and BroadcastChannel messages are not buffered. A receiving tab must be
// hydrated before another tab broadcasts, or the message is lost and the assertion times out.
// Pages without a sidebar (e.g. /vessel-search) should pass their own interactive selector.
export async function waitForHydration(page: Page, selector = SIDEBAR_CONTAINER) {
  await page.waitForFunction(
    (sel) => {
      const el = document.querySelector(sel)
      return (
        !!el &&
        Object.keys(el).some(
          (key) => key.startsWith('__reactFiber$') || key.startsWith('__reactProps$')
        )
      )
    },
    selector,
    { timeout: 30000 }
  )
}
