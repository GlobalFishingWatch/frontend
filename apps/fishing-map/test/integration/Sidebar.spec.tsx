import React from 'react'
import { render } from 'test/appTestUtils'
import { defaultState } from 'test/defaultState'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

import App from 'features/app/App'
import { makeStore } from 'store'

describe('Sidebar tools', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should open feedback modal', async () => {
    const store = makeStore(defaultState, [], true)
    const { getByTestId, getByRole } = await render(<App />, { store })

    await userEvent.hover(getByTestId('feedback-button'))
    await getByTestId('open-feedback-modal').click()
    await expect.element(getByRole('heading', { name: 'Feedback' })).toBeVisible()
  })

  it('should change language from selector', async () => {
    const store = makeStore(defaultState, [], true)
    const { getByTestId } = await render(<App />, { store })
    const activitySection = getByTestId('activity-section')

    await expect.element(activitySection.getByText(/activity/i)).toBeVisible()
    await userEvent.hover(getByTestId('language-toggle-button'))
    await getByTestId('language-toggle-button').click()
    await getByTestId('language-option-es').click()
    // await vi.waitFor(() => {
    //   expect(document.documentElement.getAttribute('lang')).toBe('es')
    // })

    await expect.element(activitySection.getByText(/actividad/i)).toBeVisible()
  })

  it('should toggle sidebar', async () => {
    const store = makeStore(defaultState, [], true)
    const { getByLabelText } = await render(<App />, { store })
    const previousSidebarOpen = store.getState()?.location?.query?.sidebarOpen

    await getByLabelText('Toggle sidebar').click()
    await new Promise((resolve) => setTimeout(resolve, 200))

    const currentSidebarOpen = store.getState()?.location?.query?.sidebarOpen
    expect(currentSidebarOpen).not.toBe(previousSidebarOpen)
  })

  it('should show help hints and allow dismissing one', async () => {
    const store = makeStore(
      {
        ...defaultState,
        hints: {
          ...defaultState.hints,
          hintsDismissed: {},
        },
      },
      [],
      true
    )
    const { getByText } = await render(<App />, { store })

    await expect.element(getByText('Dismiss').first()).toBeVisible()
    await getByText('Dismiss').first().click()
    await new Promise((resolve) => setTimeout(resolve, 200))

    expect(store.getState().hints.hintsDismissed?.fishingEffortHeatmap).toBe(true)
  })

  it('should restore help hints when requested', async () => {
    const store = makeStore(defaultState, [], true)
    const { getByTestId } = await render(<App />, { store })

    await userEvent.hover(getByTestId('help-hub-button'))
    await getByTestId('reset-help-hints').click()
    await new Promise((resolve) => setTimeout(resolve, 200))

    expect(store.getState().hints.hintsDismissed).toBeUndefined()
  })
})
