import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { LastXOption } from './timerange-selector'
import TimeRangeSelector from './timerange-selector'

// Stub the ui-components used by the modal so it renders in jsdom.
vi.mock('@globalfishingwatch/ui-components', () => ({
  FIRST_YEAR_OF_DATA: '2012',
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Select: ({ options }: { options: LastXOption[] }) => (
    <div data-testid="lastx-select">
      {options.map((o) => (
        <span key={o.id}>{o.label}</span>
      ))}
    </div>
  ),
}))

const baseProps = {
  start: '2020-06-01T00:00:00.000Z',
  end: '2020-06-15T00:00:00.000Z',
  absoluteStart: '2019-01-01T00:00:00.000Z',
  absoluteEnd: '2021-01-01T00:00:00.000Z',
  onDiscard: vi.fn(),
}

afterEach(() => cleanup())

describe('TimeRangeSelector', () => {
  it('renders start and end date inputs', () => {
    const { container } = render(<TimeRangeSelector {...baseProps} onSubmit={vi.fn()} />)
    expect(container.querySelector('[name="start year"]')).not.toBeNull()
    expect(container.querySelector('[name="end year"]')).not.toBeNull()
    expect(container.querySelector('[name="start day"]')).not.toBeNull()
  })

  it('submits the current range when the form is submitted', () => {
    const onSubmit = vi.fn()
    render(<TimeRangeSelector {...baseProps} onSubmit={onSubmit} labels={{ done: 'Done' }} />)
    fireEvent.click(screen.getByText('Done'))
    expect(onSubmit).toHaveBeenCalled()
  })

  it('discards when the veil is clicked', () => {
    const onDiscard = vi.fn()
    render(<TimeRangeSelector {...baseProps} onSubmit={vi.fn()} onDiscard={onDiscard} />)
    fireEvent.click(screen.getByTestId('timerange-veil'))
    expect(onDiscard).toHaveBeenCalled()
  })

  it('renders custom quick-select options when provided', () => {
    const lastXOptions: LastXOption[] = [
      { id: 'last1day', label: 'Last day', num: 1, unit: 'day' },
      { id: 'last2days', label: 'Last 2 days', num: 2, unit: 'day' },
      { id: 'last3days', label: 'Last 3 days', num: 3, unit: 'day' },
    ]
    render(<TimeRangeSelector {...baseProps} onSubmit={vi.fn()} lastXOptions={lastXOptions} />)
    expect(screen.getByText('Last day')).toBeTruthy()
    expect(screen.getByText('Last 3 days')).toBeTruthy()
    // The default options should not be present.
    expect(screen.queryByText('Last 30 days')).toBeNull()
  })
})
