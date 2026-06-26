import type { getFourwingsInterval } from '@globalfishingwatch/deck-loaders'

import { useTimebarActions, useTimebarState } from '../timebar-context'

import Playback from './playback'

type TimebarPlaybackProps = {
  disabled?: boolean
  disabledTooltip?: string
  onTogglePlay?: (isPlaying: boolean) => void
}

/** Playback controls (play/pause/loop/speed). Reads range + interval from context. */
export function TimebarPlayback({ disabled, disabledTooltip, onTogglePlay }: TimebarPlaybackProps) {
  const { labels, absoluteStart, intervals, getCurrentInterval, onPlaybackTick } =
    useTimebarActions()
  const { start, end } = useTimebarState()

  return (
    <Playback
      labels={labels.playback}
      start={start}
      end={end}
      absoluteStart={absoluteStart}
      // ponytail: preserves legacy behavior — the class always passed state.absoluteEnd, which was
      // never set (null), so playback never auto-stops at the data end. Wire absoluteEnd from context
      // here to fix it if desired.
      absoluteEnd={null as unknown as string}
      onTick={onPlaybackTick}
      onTogglePlay={onTogglePlay}
      intervals={intervals}
      getCurrentInterval={getCurrentInterval as typeof getFourwingsInterval}
      disabled={disabled}
      disabledPlaybackTooltip={disabledTooltip}
    />
  )
}
