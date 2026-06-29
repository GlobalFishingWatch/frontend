import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import Playback from './playback'

// jsdom can't parse the real Icon's SVG data-URI; stub it.
vi.mock('@globalfishingwatch/ui-components/icon', () => ({
  Icon: ({ icon }: { icon?: string }) => <i data-icon={icon} />,
}))

const baseProps = {
  start: '2020-01-01T00:00:00.000Z',
  end: '2020-02-01T00:00:00.000Z',
  absoluteStart: '2019-01-01T00:00:00.000Z',
  absoluteEnd: '2021-01-01T00:00:00.000Z',
}

afterEach(() => cleanup())

describe('Playback', () => {
  it('renders the playback controls', () => {
    render(<Playback {...baseProps} onTick={vi.fn()} />)
    expect(screen.queryByTestId('timebar-playback')).not.toBeNull()
    expect(screen.getByTitle('Play animation')).toBeTruthy()
    expect(screen.getByTitle('Move forward')).toBeTruthy()
    expect(screen.getByTitle('Move back')).toBeTruthy()
  })

  it('toggles play and notifies onTogglePlay', () => {
    const onTogglePlay = vi.fn()
    render(<Playback {...baseProps} onTick={vi.fn()} onTogglePlay={onTogglePlay} />)
    fireEvent.click(screen.getByTitle('Play animation'))
    expect(onTogglePlay).toHaveBeenCalledWith(true)
  })

  it('steps the range on forward/back, calling onTick', () => {
    const onTick = vi.fn()
    render(<Playback {...baseProps} onTick={onTick} />)
    fireEvent.click(screen.getByTitle('Move forward'))
    expect(onTick).toHaveBeenCalled()
  })

  it('disables play when already stopped at the data end', () => {
    const onTogglePlay = vi.fn()
    render(
      <Playback
        {...baseProps}
        end="2021-01-01T00:00:00.000Z"
        absoluteEnd="2021-01-01T00:00:00.000Z"
        onTick={vi.fn()}
        onTogglePlay={onTogglePlay}
      />
    )
    fireEvent.click(screen.getByTitle('Play animation'))
    expect(onTogglePlay).not.toHaveBeenCalled()
  })
})
