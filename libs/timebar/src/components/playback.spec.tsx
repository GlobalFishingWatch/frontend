import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { FOURWINGS_INTERVALS_ORDER, getFourwingsInterval } from '@globalfishingwatch/deck-loaders'

import { EVENT_SOURCE } from '../constants'
import { Timebar } from '../timebar'

// jsdom can't parse/resolve the real ui-components; stub them. Importing <Timebar>
// transitively pulls in the chart components that depend on these.
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
  end: '2020-02-01T00:00:00.000Z',
  absoluteStart: '2019-01-01T00:00:00.000Z',
  absoluteEnd: '2021-01-01T00:00:00.000Z',
}

const intervalProps = {
  intervals: FOURWINGS_INTERVALS_ORDER,
  getCurrentInterval: getFourwingsInterval,
}

const renderPlayback = (
  props: Partial<typeof baseProps> = {},
  playbackProps: React.ComponentProps<typeof Timebar.Playback> = {},
  onChange = vi.fn()
) => {
  render(
    <Timebar {...baseProps} {...props} {...intervalProps} onChange={onChange}>
      <Timebar.Playback {...playbackProps} />
    </Timebar>
  )
  return { onChange }
}

afterEach(() => cleanup())

describe('Playback', () => {
  it('renders the playback controls', () => {
    renderPlayback()
    expect(screen.queryByTestId('timebar-playback')).not.toBeNull()
    expect(screen.getByTitle('Play animation')).toBeTruthy()
    expect(screen.getByTitle('Move forward')).toBeTruthy()
    expect(screen.getByTitle('Move back')).toBeTruthy()
  })

  it('toggles play and notifies onTogglePlay', () => {
    const onTogglePlay = vi.fn()
    renderPlayback({}, { onTogglePlay })
    fireEvent.click(screen.getByTitle('Play animation'))
    expect(onTogglePlay).toHaveBeenCalledWith(true)
  })

  it('steps the range on forward/back, notifying a playback frame change', () => {
    const { onChange } = renderPlayback()
    onChange.mockClear() // drop the mount notification
    fireEvent.click(screen.getByTitle('Move forward'))
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ source: EVENT_SOURCE.PLAYBACK_FRAME })
    )
  })

  it('disables play when already stopped at the data end', () => {
    const onTogglePlay = vi.fn()
    renderPlayback(
      { end: '2021-01-01T00:00:00.000Z', absoluteEnd: '2021-01-01T00:00:00.000Z' },
      { onTogglePlay }
    )
    fireEvent.click(screen.getByTitle('Play animation'))
    expect(onTogglePlay).not.toHaveBeenCalled()
  })
})
