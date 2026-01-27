import { render } from 'test/appTestUtils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { makeStore } from 'store'

import Timebar from './Timebar'
import * as timebarHooks from './timebar.hooks'

describe('Timebar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render Timebar component with heatmap visualization by default', async () => {
    render(<Timebar />)

    const spy = vi.mocked(timebarHooks.useTimebarVisualisationConnect)

    expect(spy).toHaveReturnedWith({
      dispatchTimebarVisualisation: expect.any(Function),
      timebarVisualisation: 'heatmap',
    })
  })

  it('should call onTimebarChange with new time interval on yearly data button click', async () => {
    const store = makeStore()

    vi.mock('./timebar.hooks', { spy: true })
    const onTimebarChangeSpy = vi.fn()

    vi.mocked(timebarHooks.useTimerangeConnect).mockReturnValue({
      start: '2020-01-01',
      end: '2020-01-02',
      onTimebarChange: onTimebarChangeSpy,
      setTimerange: vi.fn(),
      timerange: { start: '2025-01-01', end: '2025-01-02' },
    })

    const { getByTestId } = await render(<Timebar />, {
      store,
    })

    const yearButton = getByTestId('interval-btn-year')
    await yearButton.click()

    // Now you can assert on the spy
    expect(onTimebarChangeSpy).toHaveBeenCalledWith(
      '2012-01-01T00:00:00.000Z',
      '2026-12-31T23:59:59.999Z'
    )
  })
})
