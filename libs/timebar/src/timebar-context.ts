import type { FourwingsInterval, getFourwingsInterval } from '@globalfishingwatch/deck-loaders'

import type { ISODateString } from './timeline/timeline-context'
import { createGuardedContext } from './utils/create-guarded-context'
import type { TimebarProps } from './timebar'

export type TimebarContextProps = {
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
  start: ISODateString
  end: ISODateString
  showTimeRangeSelector: boolean
  hasBookmark: boolean
  bookmarkDisabled: boolean
  bookmarkStart?: ISODateString | null
  bookmarkEnd?: ISODateString | null
}

export const [TimebarContext, useTimebar] = createGuardedContext<TimebarContextProps>('useTimebar')
