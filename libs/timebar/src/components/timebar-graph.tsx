import type React from 'react'

import { useTimebarActions, useTimebarState } from '../timebar-context'
import type {
  StickUnit,
  TimebarLocale,
  TimebarMouseLeaveHandler,
  TimebarMouseMoveHandler,
  TrackGraphOrientation,
} from '../timeline-context'

import Timeline from './timeline'

type TimebarGraphProps = {
  children?: React.ReactNode
  locale?: TimebarLocale
  fullWidth?: boolean
  showLast30DaysBtn?: boolean
  bookmarkPlacement?: string
  trackGraphOrientation?: TrackGraphOrientation
  stickToUnit?: (start: string, end: string) => StickUnit
  displayWarningWhenInFuture?: boolean
  onMouseLeave?: TimebarMouseLeaveHandler
  onMouseMove?: TimebarMouseMoveHandler
  onGraphClick?: () => void
}

/**
 * The timebar graph/axis (elastic flex filler). Charts are passed as children.
 * Required member of <Timebar> — the root does not auto-render a Timeline.
 * Graph-only rendering config lives here as props (not on <Timebar>).
 */
export function TimebarGraph({
  children,
  locale = 'en',
  fullWidth = false,
  showLast30DaysBtn = true,
  bookmarkPlacement = 'top',
  trackGraphOrientation,
  stickToUnit,
  displayWarningWhenInFuture = true,
  onMouseLeave,
  onMouseMove,
  onGraphClick,
}: TimebarGraphProps) {
  const { notifyChange, labels, absoluteStart, absoluteEnd, latestAvailableDataDate, onBookmarkChange } =
    useTimebarActions()
  const { start, end, bookmarkStart, bookmarkEnd } = useTimebarState()

  return (
    <Timeline
      start={start}
      end={end}
      labels={labels}
      fullWidth={fullWidth}
      showLast30DaysBtn={showLast30DaysBtn}
      onChange={notifyChange}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      absoluteStart={absoluteStart}
      absoluteEnd={absoluteEnd}
      onBookmarkChange={onBookmarkChange}
      bookmarkStart={bookmarkStart ?? undefined}
      bookmarkEnd={bookmarkEnd ?? undefined}
      bookmarkPlacement={bookmarkPlacement}
      latestAvailableDataDate={latestAvailableDataDate as string}
      trackGraphOrientation={trackGraphOrientation as TrackGraphOrientation}
      stickToUnit={stickToUnit}
      displayWarningWhenInFuture={displayWarningWhenInFuture}
      locale={locale}
      onGraphClick={onGraphClick}
    >
      {children}
    </Timeline>
  )
}
