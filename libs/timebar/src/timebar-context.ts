import type { RefObject } from 'react'

import type { FourwingsInterval, getFourwingsInterval } from '@globalfishingwatch/deck-loaders'

import type { ISODateString } from './timeline/timeline-context'
import { createGuardedContext } from './utils/create-guarded-context'
import type { TimebarChangeSource } from './timebar'
import type { TimebarLabels } from './timebar-labels'

export type TimebarContextProps = {
  notifyChange: (
    start: string,
    end: string,
    source?: TimebarChangeSource,
    clampToEnd?: boolean
  ) => void
  // Synchronous live range driven by playback/drag loops (single source of truth).
  rangeRef: RefObject<{ start: string; end: string }>
  onBookmarkChange?: (start: string, end: string) => void
  intervals?: FourwingsInterval[]
  getCurrentInterval?: typeof getFourwingsInterval
  labels: TimebarLabels
  absoluteStart: ISODateString
  absoluteEnd: ISODateString
  latestAvailableDataDate?: ISODateString
  start: ISODateString
  end: ISODateString
  bookmarkStart?: ISODateString | null
  bookmarkEnd?: ISODateString | null
}

export const [TimebarContext, useTimebar] = createGuardedContext<TimebarContextProps>('useTimebar')
