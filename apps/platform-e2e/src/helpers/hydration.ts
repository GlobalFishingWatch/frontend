import type { Page } from 'playwright/test'

// Resolves once React has hydrated the sidebar on the client. The app is server-rendered, so
// markup (and getByTestId locators) are visible before the client takes over. React 18 tags a
// DOM node with internal __reactFiber$/__reactProps$ keys only when its fiber commits during
// hydration, so their presence is a reliable hydration signal.
//
// This matters for the cross-tab tests: each tab registers its BroadcastChannel listener in a
// hydration effect, and BroadcastChannel messages are not buffered. A receiving tab must be
// hydrated before another tab broadcasts, or the message is lost and the assertion times out.
export async function waitForHydration(page: Page) {
  await page.waitForFunction(
    () => {
      const el = document.querySelector('[data-testid="sidebar-container"]')
      return (
        !!el &&
        Object.keys(el).some(
          (key) => key.startsWith('__reactFiber$') || key.startsWith('__reactProps$')
        )
      )
    },
    undefined,
    { timeout: 30000 }
  )
}
