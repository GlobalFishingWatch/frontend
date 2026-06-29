import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { FOURWINGS_INTERVALS_ORDER, getFourwingsInterval } from '@globalfishingwatch/deck-loaders'

import { EVENT_INTERVAL_SOURCE, EVENT_SOURCE } from './constants'
import { Timebar } from './timebar'
import type { TimebarActionsContextProps } from './timebar-context'
import { useTimebarActions } from './timebar-context'
import { useTimelineContext } from './timeline-context'

// The real ui-components Icon renders an inline SVG data-URI that jsdom can't parse
// (InvalidCharacterError). Stub it so we can test the timebar composition in jsdom.
// (vitest hoists vi.mock above the imports above, so the stub is applied before they load.)
vi.mock('@globalfishingwatch/ui-components/icon', () => ({
  Icon: ({ icon }: { icon?: string }) => <i data-icon={icon} />,
}))
vi.mock('@globalfishingwatch/ui-components/icon-button', () => ({
  IconButton: ({ icon, ...rest }: { icon?: string } & Record<string, unknown>) => (
    <button data-icon={icon} {...rest} />
  ),
}))
vi.mock('@globalfishingwatch/ui-components/tooltip', () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))
vi.mock('@globalfishingwatch/ui-components/select', () => ({
  Select: () => <div data-testid="lastx-select" />,
}))

const ABSOLUTE_START = '2012-01-01T00:00:00.000Z'
const ABSOLUTE_END = '2026-12-31T23:59:59.999Z'

const baseProps = {
  start: '2020-01-01T00:00:00.000Z',
  end: '2020-06-01T00:00:00.000Z',
  absoluteStart: ABSOLUTE_START,
  absoluteEnd: ABSOLUTE_END,
}

const intervalProps = {
  intervals: FOURWINGS_INTERVALS_ORDER,
  getCurrentInterval: getFourwingsInterval,
}

afterEach(() => cleanup())

describe('Timebar (compound)', () => {
  it('renders only the composed controls', () => {
    render(
      <Timebar {...baseProps} {...intervalProps} onChange={vi.fn()}>
        <Timebar.Playback />
        <Timebar.Controls>
          <Timebar.TimeRangeSelector />
          <Timebar.Bookmark />
        </Timebar.Controls>
        <Timebar.IntervalSelector />
      </Timebar>
    )

    expect(screen.queryByTestId('timebar-playback')).not.toBeNull()
    expect(screen.queryByTestId('timebar-timerange-button')).not.toBeNull()
    expect(screen.queryByTestId('timebar-bookmark-button')).not.toBeNull()
    expect(screen.queryByTestId('interval-btn-year')).not.toBeNull()
  })

  it('omits controls that are not composed (explicit composition, no flags)', () => {
    render(
      <Timebar {...baseProps} {...intervalProps} onChange={vi.fn()}>
        <Timebar.IntervalSelector />
      </Timebar>
    )

    expect(screen.queryByTestId('timebar-playback')).toBeNull()
    expect(screen.queryByTestId('timebar-timerange-button')).toBeNull()
    expect(screen.queryByTestId('timebar-bookmark-button')).toBeNull()
    expect(screen.queryByTestId('interval-btn-year')).not.toBeNull()
  })

  it('notifies the initial range on mount (MOUNT source preserved)', () => {
    const onChange = vi.fn()
    render(<Timebar {...baseProps} onChange={onChange} />)

    expect(onChange).toHaveBeenCalledWith({
      start: baseProps.start,
      end: baseProps.end,
      source: EVENT_SOURCE.MOUNT,
    })
  })

  it('notifies the absolute range tagged with the interval source on interval click', () => {
    const onChange = vi.fn()
    render(
      <Timebar {...baseProps} {...intervalProps} onChange={onChange}>
        <Timebar.IntervalSelector />
      </Timebar>
    )
    onChange.mockClear() // drop the mount notification

    fireEvent.click(screen.getByTestId('interval-btn-year'))

    expect(onChange).toHaveBeenCalledWith({
      start: ABSOLUTE_START,
      end: ABSOLUTE_END,
      source: EVENT_INTERVAL_SOURCE.YEAR,
    })
  })

  it('calls onBookmarkChange with the current range when the bookmark button is clicked', () => {
    const onBookmarkChange = vi.fn()
    render(
      <Timebar {...baseProps} onChange={vi.fn()} onBookmarkChange={onBookmarkChange}>
        <Timebar.Controls>
          <Timebar.Bookmark />
        </Timebar.Controls>
      </Timebar>
    )

    fireEvent.click(screen.getByTestId('timebar-bookmark-button'))

    expect(onBookmarkChange).toHaveBeenCalledWith(baseProps.start, baseProps.end)
  })

  it('renders nothing for the interval selector when no intervals are provided', () => {
    render(
      <Timebar {...baseProps} onChange={vi.fn()}>
        <Timebar.IntervalSelector />
      </Timebar>
    )

    expect(screen.queryByTestId('interval-btn-year')).toBeNull()
  })

  it('renders charts passed to the graph slot', () => {
    render(
      <Timebar {...baseProps} onChange={vi.fn()}>
        <Timebar.Graph>
          <div data-testid="graph-child" />
        </Timebar.Graph>
      </Timebar>
    )

    expect(screen.queryByTestId('graph-child')).not.toBeNull()
  })

  it('throws when a compound member is used outside <Timebar>', () => {
    // The guarded context hooks surface misuse instead of silently reading an empty context.
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Timebar.Bookmark />)).toThrow(/within a <Timebar>/)
    spy.mockRestore()
  })
})

// A probe chart that reads the d3 timeline/scale context the graphs depend on.
function GraphProbe() {
  const { outerScale, overallScale, outerStart, outerEnd } = useTimelineContext()
  return (
    <div
      data-testid="graph-probe"
      data-outer-scale={typeof outerScale}
      data-overall-scale={typeof overallScale}
      data-outer-start={outerStart}
      data-outer-end={outerEnd}
    />
  )
}

describe('Timebar.Graph (timeline scale context)', () => {
  it('provides the d3 scale context to charts rendered inside the graph slot', () => {
    render(
      <Timebar {...baseProps} onChange={vi.fn()}>
        <Timebar.Graph>
          <GraphProbe />
        </Timebar.Graph>
      </Timebar>
    )

    const probe = screen.getByTestId('graph-probe')
    // Charts get usable d3 scales (functions) plus the outer range bounds.
    expect(probe.getAttribute('data-outer-scale')).toBe('function')
    expect(probe.getAttribute('data-overall-scale')).toBe('function')
    expect(probe.getAttribute('data-outer-start')).toBeTruthy()
    expect(probe.getAttribute('data-outer-end')).toBeTruthy()
  })

  it('throws when a chart reads the timeline context outside a graph', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<GraphProbe />)).toThrow(/within a Timeline provider/)
    spy.mockRestore()
  })
})

const actionsHolder: { current?: TimebarActionsContextProps } = {}
function ActionsProbe() {
  // eslint-disable-next-line react-hooks/immutability -- test probe capturing the context value
  actionsHolder.current = useTimebarActions()
  return null
}

describe('Timebar actions context stability', () => {
  it('stays stable across volatile state changes and updates on config changes', () => {
    const onChange = vi.fn()
    const { rerender } = render(
      <Timebar {...baseProps} onChange={onChange}>
        <ActionsProbe />
      </Timebar>
    )
    const first = actionsHolder.current

    // start/end live in the *state* context -> actions reference must not change.
    rerender(
      <Timebar
        {...baseProps}
        start="2021-01-01T00:00:00.000Z"
        end="2021-06-01T00:00:00.000Z"
        onChange={onChange}
      >
        <ActionsProbe />
      </Timebar>
    )
    expect(actionsHolder.current).toBe(first)

    // latestAvailableDataDate lives in the actions context -> reference must change.
    rerender(
      <Timebar {...baseProps} latestAvailableDataDate="2020-03-01T00:00:00.000Z" onChange={onChange}>
        <ActionsProbe />
      </Timebar>
    )
    expect(actionsHolder.current).not.toBe(first)
  })
})
