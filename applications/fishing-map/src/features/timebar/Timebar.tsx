import React, { Fragment, memo, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import TimebarComponent, {
  TimebarTracks,
  TimebarActivity,
  TimebarHighlighter,
} from '@globalfishingwatch/timebar'
import { useSmallScreen } from '@globalfishingwatch/react-hooks'
import { useTimerangeConnect, useTimebarVisualisation } from 'features/timebar/timebar.hooks'
import { DEFAULT_WORKSPACE } from 'data/config'
import { TimebarVisualisations, TimebarGraphs } from 'types'
import { selectTimebarGraph } from 'features/app/app.selectors'
import { selectActivityCategory } from 'routes/routes.selectors'
import {
  setHighlightedTime,
  disableHighlightedTime,
  selectHighlightedTime,
  Range,
} from './timebar.slice'
import TimebarSettings from './TimebarSettings'
import { selectTracksData, selectTracksGraphs } from './timebar.selectors'
import TimebarActivityGraph from './TimebarActivityGraph'

export const TIMEBAR_HEIGHT = 72

const TimebarWrapper = () => {
  const { ready, i18n } = useTranslation()
  const labels = ready ? (i18n?.getDataByLanguage(i18n.language) as any)?.timebar : undefined
  const { start, end, onTimebarChange } = useTimerangeConnect()
  const highlightedTime = useSelector(selectHighlightedTime)
  const { timebarVisualisation } = useTimebarVisualisation()
  const timebarGraph = useSelector(selectTimebarGraph)
  const tracks = useSelector(selectTracksData)
  const tracksGraph = useSelector(selectTracksGraphs)

  const dispatch = useDispatch()

  const [bookmark, setBookmark] = useState<{ start: string; end: string } | null>(null)
  const onBookmarkChange = useCallback(
    (start, end) => {
      if (!start || !end) {
        setBookmark(null)
        return
      }
      setBookmark({ start, end })
    },
    [setBookmark]
  )

  const isSmallScreen = useSmallScreen()

  const activityCategory = useSelector(selectActivityCategory)

  const onMouseMove = useCallback(
    (clientX: number, scale: (arg: number) => Date) => {
      if (clientX === null) {
        if (highlightedTime !== undefined) {
          dispatch(disableHighlightedTime())
        }
      } else {
        const start = scale(clientX - 10).toISOString()
        const end = scale(clientX + 10).toISOString()
        dispatch(setHighlightedTime({ start, end }))
      }
    },
    [dispatch, highlightedTime]
  )

  const [internalRange, setInternalRange] = useState<Range | null>(null)
  const onChange = useCallback(
    (e) => {
      if (e.source === 'ZOOM_OUT_MOVE') {
        setInternalRange({ ...e })
        return
      }
      setInternalRange(null)
      onTimebarChange(e.start, e.end)
    },
    [setInternalRange, onTimebarChange]
  )

  if (!start || !end) return null

  return (
    <div>
      <TimebarComponent
        enablePlayback={true}
        labels={labels}
        start={internalRange ? internalRange.start : start}
        end={internalRange ? internalRange.end : end}
        absoluteStart={DEFAULT_WORKSPACE.availableStart}
        absoluteEnd={DEFAULT_WORKSPACE.availableEnd}
        onChange={onChange}
        showLastUpdate={false}
        onMouseMove={onMouseMove}
        onBookmarkChange={onBookmarkChange}
        bookmarkStart={bookmark?.start}
        bookmarkEnd={bookmark?.end}
        bookmarkPlacement="bottom"
        minimumRange={1}
        minimumRangeUnit={activityCategory === 'fishing' ? 'hour' : 'day'}
      >
        {!isSmallScreen
          ? () => (
              <Fragment>
                {timebarVisualisation === TimebarVisualisations.Heatmap && <TimebarActivityGraph />}
                {timebarVisualisation === TimebarVisualisations.Vessel && tracks?.length && (
                  <Fragment>
                    {timebarGraph !== TimebarGraphs.Speed && (
                      <TimebarTracks key="tracks" tracks={tracks} />
                    )}
                    {timebarGraph === TimebarGraphs.Speed && tracksGraph && (
                      <TimebarActivity key="trackActivity" graphTracks={tracksGraph} />
                    )}
                  </Fragment>
                )}
                {highlightedTime && (
                  <TimebarHighlighter
                    hoverStart={highlightedTime.start}
                    hoverEnd={highlightedTime.end}
                    activity={
                      timebarVisualisation === TimebarVisualisations.Vessel &&
                      timebarGraph === TimebarGraphs.Speed &&
                      tracksGraph
                        ? tracksGraph
                        : null
                    }
                    unit="knots"
                  />
                )}
              </Fragment>
            )
          : null}
      </TimebarComponent>
      {!isSmallScreen && <TimebarSettings />}
    </div>
  )
}

export default memo(TimebarWrapper)
