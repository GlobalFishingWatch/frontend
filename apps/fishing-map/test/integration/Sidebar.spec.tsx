import { render } from 'test/appTestUtils'
import { defaultState } from 'test/utils/store'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

import { HINTS } from 'data/config'
import i18n from 'features/i18n/i18n'
import { makeStore } from 'store'

describe('Sidebar tools', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    await i18n.changeLanguage('en')
  })

  afterEach(async () => {
    await i18n.changeLanguage('en')
    localStorage.removeItem(HINTS)
  })

  it('should open feedback modal', async () => {
    const store = makeStore(defaultState)
    const { getByTestId } = await render({ store })

    await userEvent.hover(getByTestId('feedback-button'))
    await expect.element(getByTestId('feedback-menu')).toBeVisible()
    await expect.element(getByTestId('open-feedback-modal')).toBeVisible()
    await getByTestId('open-feedback-modal').click()
    await expect.element(getByTestId('feedback-modal')).toBeVisible()
  })

  it('should change language from selector', async () => {
    const store = makeStore({
      ...defaultState,
      datasets: {
        ...defaultState.datasets,
        ids: [],
        entities: {},
      },
    })
    const { getByTestId } = await render({ store })
    const activitySection = getByTestId('activity-section')

    await expect.element(activitySection.getByText(/activity/i)).toBeVisible()
    await userEvent.hover(getByTestId('language-toggle-container'))
    await expect.element(getByTestId('language-menu')).toBeVisible()
    await expect.element(getByTestId('language-option-es')).toBeVisible()
    await getByTestId('language-option-es').click()

    await expect.element(activitySection.getByText(/actividad/i)).toBeVisible()
  })

  it('should toggle sidebar', async () => {
    const store = makeStore(defaultState)
    const { getByLabelText } = await render({ store })
    const previousSidebarOpen = store.getState()?.location?.query?.sidebarOpen

    await getByLabelText('Toggle sidebar').click()

    await vi.waitFor(() => {
      const currentSidebarOpen = store.getState()?.location?.query?.sidebarOpen
      expect(currentSidebarOpen).not.toBe(previousSidebarOpen)
    })
  })

  it('should show help hints and allow dismissing one', async () => {
    localStorage.setItem(HINTS, '{}')
    const store = makeStore(
      {
        ...defaultState,
        hints: {
          ...defaultState.hints,
          hintsDismissed: {},
        },
      },
      []
    )
    const { getByText } = await render({ store })

    await expect.element(getByText('Dismiss').first()).toBeVisible()
    await userEvent.click(getByText('Dismiss').first())

    await vi.waitFor(() => {
      expect(store.getState().hints.hintsDismissed?.fishingEffortHeatmap).toBe(true)
    })
  })

  it('should restore help hints when requested', async () => {
    // Seed localStorage so the app's hydrateHintsDismissed effect finds dismissed hints
    // and renders the reset button (it only appears when hints have been dismissed)
    localStorage.setItem(HINTS, JSON.stringify(defaultState.hints.hintsDismissed))
    const store = makeStore(defaultState)
    const { getByTestId } = await render({ store })

    await userEvent.hover(getByTestId('help-hub-button'))
    await expect.element(getByTestId('reset-help-hints')).toBeVisible()
    await getByTestId('reset-help-hints').click()

    await vi.waitFor(() => {
      expect(store.getState().hints.hintsDismissed).toBeUndefined()
    })
  })
})
