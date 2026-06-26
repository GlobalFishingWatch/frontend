import { createContext, useContext } from 'react'

import type { FourwingsInterval, getFourwingsInterval } from '@globalfishingwatch/deck-loaders'

import type { TimebarProps } from './timebar'
import type { ISODateString, StickUnit, TrackGraphOrientation } from './timeline-context'

/**
 * Stable slice of the Timebar context: handlers + config whose references rarely
 * change. Memoized in the provider so subscribers don't re-render on playback ticks.
 */
export type TimebarActionsContextProps = {
  notifyChange: (start: string, end: string, source?: string, clampToEnd?: boolean) => void
  onIntervalClick: (interval: FourwingsInterval) => void
  onPlaybackTick: (start: string, end: string) => void
  onTimeRangeSelectorSubmit: (start: string, end: string) => void
  onBookmarkChange?: (start: string, end: string) => void
  setBookmark: () => void
  toggleTimeRangeSelector: () => void
  onMouseLeave?: TimebarProps['onMouseLeave']
  onMouseMove?: TimebarProps['onMouseMove']
  onGraphClick?: () => void
  intervals?: FourwingsInterval[]
  getCurrentInterval?: typeof getFourwingsInterval
  labels: NonNullable<TimebarProps['labels']>
  locale: TimebarProps['locale']
  absoluteStart: ISODateString
  absoluteEnd: ISODateString
  latestAvailableDataDate?: ISODateString
  bookmarkPlacement?: string
  isResizable?: boolean
  fullWidth?: boolean
  showLast30DaysBtn?: boolean
  trackGraphOrientation?: TrackGraphOrientation
  stickToUnit?: (start: string, end: string) => StickUnit
  displayWarningWhenInFuture?: boolean
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

export const TimebarActionsContext = createContext<TimebarActionsContextProps | null>(null)
export const TimebarStateContext = createContext<TimebarStateContextProps | null>(null)

export function useTimebarActions() {
  const context = useContext(TimebarActionsContext)
  if (context === null) {
    throw new Error('useTimebarActions must be used within a <Timebar>')
  }
  return context
}

export function useTimebarState() {
  const context = useContext(TimebarStateContext)
  if (context === null) {
    throw new Error('useTimebarState must be used within a <Timebar>')
  }
  return context
}
