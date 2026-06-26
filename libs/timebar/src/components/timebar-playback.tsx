import { useTimebarActions, useTimebarState } from '../timebar-context'

import Playback from './playback'

type TimebarPlaybackProps = {
  disabled?: boolean
  disabledTooltip?: string
  onTogglePlay?: (isPlaying: boolean) => void
}

/** Playback controls (play/pause/loop/speed). Reads range + interval from context. */
export function TimebarPlayback({ disabled, disabledTooltip, onTogglePlay }: TimebarPlaybackProps) {
  const { labels, absoluteStart, absoluteEnd, intervals, getCurrentInterval, onPlaybackTick } =
    useTimebarActions()
  const { start, end } = useTimebarState()

  return (
    <Playback
      labels={labels.playback}
      start={start}
      end={end}
      absoluteStart={absoluteStart}
      absoluteEnd={absoluteEnd}
      onTick={onPlaybackTick}
      onTogglePlay={onTogglePlay}
      intervals={intervals}
      getCurrentInterval={getCurrentInterval}
      disabled={disabled}
      disabledPlaybackTooltip={disabledTooltip}
    />
  )
}
