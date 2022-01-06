import { createContext } from 'react'
export type TimelineScale = (date: Date | number) => number

export type TimelineContextProps = {
  start: string
  end: string
  outerScale: TimelineScale
  outerStart: string // ISO
  outerEnd: string // ISO
  outerWidth: number
  outerHeight: number
  graphHeight: number
  innerWidth: number
  innerStartPx: number
  innerEndPx: number
  overallScale: TimelineScale
  svgTransform: string
  tooltipContainer: Element
}

export const TimelineContext = createContext<TimelineContextProps>({} as TimelineContextProps)

export default TimelineContext
