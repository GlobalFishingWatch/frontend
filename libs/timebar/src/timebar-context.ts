import type { FourwingsInterval, getFourwingsInterval } from '@globalfishingwatch/deck-loaders'

import { createGuardedContext } from './create-guarded-context'
import type { TimebarProps } from './timebar'
import type { ISODateString } from './timeline-context'

/**
 * Stable slice of the Timebar context: handlers + range/config shared by several compound
 * children. Memoized in the provider so subscribers don't re-render on playback ticks.
 * Config used by a single child is a prop on that child, not threaded here.
 */
export type TimebarActionsContextProps = {
  notifyChange: (start: string, end: string, source?: string, clampToEnd?: boolean) => void
  onIntervalClick: (interval: FourwingsInterval) => void
  onPlaybackTick: (start: string, end: string) => void
  onTimeRangeSelectorSubmit: (start: string, end: string) => void
  onBookmarkChange?: (start: string, end: string) => void
  setBookmark: () => void
  toggleTimeRangeSelector: () => void
  intervals?: FourwingsInterval[]
  getCurrentInterval?: typeof getFourwingsInterval
  labels: NonNullable<TimebarProps['labels']>
  absoluteStart: ISODateString
  absoluteEnd: ISODateString
  latestAvailableDataDate?: ISODateString
}

/** Volatile slice: changes on every range update (playback tick, drag, zoom). */
export type TimebarStateContextProps = {
  start: ISODateString
  end: ISODateString
  showTimeRangeSelector: boolean
  hasBookmark: boolean
  bookmarkDisabled: boolean
  bookmarkStart?: ISODateString | null
  bookmarkEnd?: ISODateString | null
}

export const [TimebarActionsContext, useTimebarActions] =
  createGuardedContext<TimebarActionsContextProps>('useTimebarActions')

export const [TimebarStateContext, useTimebarState] =
  createGuardedContext<TimebarStateContextProps>('useTimebarState')
