import type React from 'react'

import { useTimebarActions, useTimebarState } from '../timebar-context'
import type { TrackGraphOrientation } from '../timeline-context'

import Timeline from './timeline'

/**
 * The timebar graph/axis (elastic flex filler). Charts are passed as children.
 * Required member of <Timebar> — the root does not auto-render a Timeline.
 */
export function TimebarGraph({ children }: { children?: React.ReactNode }) {
  const {
    notifyChange,
    labels,
    fullWidth,
    showLast30DaysBtn,
    onMouseLeave,
    onMouseMove,
    absoluteStart,
    absoluteEnd,
    onBookmarkChange,
    bookmarkPlacement,
    latestAvailableDataDate,
    trackGraphOrientation,
    stickToUnit,
    displayWarningWhenInFuture,
    locale,
    onGraphClick,
  } = useTimebarActions()
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
