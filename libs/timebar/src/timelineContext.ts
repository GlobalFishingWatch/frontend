import { createContext } from 'react'
export type TimelineScale = (date: Date | number) => number

export type TrackGraphOrientation = 'up' | 'down' | 'mirrored'

export type TimelineContextProps = {
  start: string
  end: string
  outerStart: string // ISO
  outerEnd: string // ISO
  outerWidth: number
  outerHeight: number
  graphHeight: number
  innerWidth: number
  innerStartPx: number
  innerEndPx: number
  overallScale: TimelineScale
  outerScale: TimelineScale
  svgTransform: string
  tooltipContainer: Element
  trackGraphOrientation: TrackGraphOrientation
}

export const TimelineContext = createContext<TimelineContextProps>({} as TimelineContextProps)

export default TimelineContext
