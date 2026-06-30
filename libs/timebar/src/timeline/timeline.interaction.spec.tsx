import { cleanup, fireEvent, render } from '@testing-library/react'
import type { Mock } from 'vitest'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { EVENT_SOURCE } from '../constants'
import type { TimebarChangeEvent } from '../timebar'
import { Timebar } from '../timebar'

type ChangeMock = Mock<(event: TimebarChangeEvent) => void>

// Match the lightweight ui-component stubs used by timebar.spec so the timeline subtree
// (Handler icons, etc.) renders in jsdom without pulling the real components.
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

const baseProps = {
  start: '2020-01-01T00:00:00.000Z',
  end: '2020-06-01T00:00:00.000Z',
  absoluteStart: '2012-01-01T00:00:00.000Z',
  absoluteEnd: '2026-12-31T23:59:59.999Z',
}

// Renders the timeline (via the Charts graph slot) and returns the graph drag area.
// The inner d3 scale is built on mount, so panning works without layout measurement.
const renderTimeline = (onChange: ChangeMock) => {
  render(
    <Timebar {...baseProps} onChange={onChange}>
      <Timebar.Charts.Wrapper>
        <div data-testid="graph-child" />
      </Timebar.Charts.Wrapper>
    </Timebar>
  )
  const graph = document.querySelector('[data-test="timeline-graph"]') as HTMLElement
  expect(graph).not.toBeNull()
  return graph
}

const sourcesOf = (onChange: ChangeMock) =>
  onChange.mock.calls.map((call) => call[0].source)

afterEach(() => cleanup())

describe('Timebar timeline interaction (hooks integration)', () => {
  it('emits SEEK_MOVE while panning and SEEK_RELEASE on release', () => {
    const onChange: ChangeMock = vi.fn()
    const graph = renderTimeline(onChange)
    onChange.mockClear() // drop the mount notification

    fireEvent.mouseDown(graph, { clientX: 100 })
    fireEvent.mouseMove(document, { clientX: 80 })
    expect(sourcesOf(onChange)).toContain(EVENT_SOURCE.SEEK_MOVE)

    onChange.mockClear()
    fireEvent.mouseUp(document, { clientX: 80 })
    expect(sourcesOf(onChange)).toContain(EVENT_SOURCE.SEEK_RELEASE)
  })

  it('keeps the range advancing forward when panning left', () => {
    const onChange: ChangeMock = vi.fn()
    const graph = renderTimeline(onChange)
    onChange.mockClear()

    fireEvent.mouseDown(graph, { clientX: 100 })
    fireEvent.mouseMove(document, { clientX: 60 })

    const move = onChange.mock.calls.find((c) => c[0].source === EVENT_SOURCE.SEEK_MOVE)?.[0]
    expect(move).toBeTruthy()
    // dragging the graph left moves the window to a later start than the original
    expect(new Date(move!.start).getTime()).toBeGreaterThan(new Date(baseProps.start).getTime())
  })

  it('does not emit on a window move without a prior mousedown', () => {
    const onChange: ChangeMock = vi.fn()
    renderTimeline(onChange)
    onChange.mockClear()

    fireEvent.mouseMove(document, { clientX: 80 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('resets on touchcancel so an aborted gesture stops driving the range', () => {
    const onChange: ChangeMock = vi.fn()
    const graph = renderTimeline(onChange)
    onChange.mockClear()

    fireEvent.mouseDown(graph, { clientX: 100 })
    fireEvent(document, new Event('touchcancel', { bubbles: true }))
    onChange.mockClear()

    fireEvent.mouseMove(document, { clientX: 60 })
    expect(onChange).not.toHaveBeenCalled()
  })
})
