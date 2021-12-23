import { Fragment, useContext, useMemo } from 'react'
import { createPortal } from 'react-dom'
import dayjs from 'dayjs'
import cx from 'classnames'
import TimelineContext from '../timelineContext'
import { TimelineContextProps, TimelineScale } from '../types'
import { getDefaultFormat } from '../utils/internal-utils'
import styles from './highlighter.module.css'
import { TimebarChartData, TimebarChartChunk, TimebarChartItem } from './common/types'

const getCoords = (hoverStart: string, hoverEnd: string, outerScale: TimelineScale) => {
  const hoverStartDate = new Date(hoverStart)
  const hoverEndDate = new Date(hoverEnd)
  const left = outerScale(hoverStartDate)
  const width = outerScale(hoverEndDate) - left
  const centerMs = Math.round(
    hoverStartDate.getTime() + (hoverEndDate.getTime() - hoverStartDate.getTime()) / 2
  )
  const centerDate = new Date(centerMs)
  const format = getDefaultFormat(hoverStart, hoverEnd)
  const centerDateLabel = dayjs(centerDate).utc().format(format)
  const center = outerScale(centerDate)
  return {
    left,
    center,
    width,
    centerMs,
    centerDateLabel,
  }
}

const findChunk = (centerMs: number, item: TimebarChartItem) => {
  const foundChunk = item.chunks.find((chunk: TimebarChartChunk, chunkIndex: number) => {
    const chunkEnd = chunk.end || item.chunks[chunkIndex + 1]?.start || Number.NEGATIVE_INFINITY
    return centerMs > chunk.start && centerMs < chunkEnd
  })
  return foundChunk
}

const findValue = (centerMs: number, chunk: TimebarChartChunk) => {
  if (!chunk.values) return undefined
  const foundValue = chunk.values.find((value, valueIndex) => {
    const valueEnd =
      chunk.values![valueIndex + 1]?.timestamp || chunk.end || Number.NEGATIVE_INFINITY
    return centerMs > value.timestamp && centerMs < valueEnd
  })
  return foundValue
}

type HighlighterData = {
  labels?: ({ value?: string; isMain: boolean } | undefined)[]
  color?: string
}

const getHighlighterData = (
  centerMs: number,
  data?: TimebarChartData[]
): (HighlighterData | undefined)[] => {
  if (!data || !data.length) return []

  let highlighterData: (HighlighterData | undefined)[] = data[0].map((mainItem) => {
    return {
      color: mainItem.color,
      labels: [],
    }
  })

  data.forEach((datum, datumIndex) => {
    datum.forEach((item, itemIndex) => {
      const foundChunk = findChunk(centerMs, item)
      let label = undefined
      if (foundChunk) {
        const foundValue = findValue(centerMs, foundChunk)
        label = item.getHighlighterLabel
          ? typeof item.getHighlighterLabel === 'string'
            ? item.getHighlighterLabel
            : item.getHighlighterLabel(foundChunk, foundValue)
          : foundValue?.value?.toString()
      }
      highlighterData[itemIndex]!.labels![datumIndex] = {
        value: label,
        isMain: datumIndex === 0 && data.length > 1,
      }
    })
  })

  highlighterData = highlighterData.map((item) => {
    if (!item) return undefined
    if (item.labels?.every((l) => !l?.value)) return undefined
    return item
  })

  return highlighterData
}

const Highlighter = ({
  hoverStart,
  hoverEnd,
  data,
}: {
  hoverStart: string
  hoverEnd: string
  data?: TimebarChartData[]
}) => {
  const { outerScale, graphHeight, tooltipContainer } = useContext(
    TimelineContext
  ) as TimelineContextProps
  const { width, left, center, centerMs, centerDateLabel } = useMemo(
    () => getCoords(hoverStart, hoverEnd, outerScale),
    [hoverStart, hoverEnd, outerScale]
  )

  // TODO filter first?
  const highlighterData = useMemo(() => {
    return getHighlighterData(centerMs, data)
  }, [centerMs, data])

  return (
    <Fragment>
      <div
        className={styles.highlighter}
        style={{
          left,
          width,
          height: graphHeight,
        }}
      >
        <div className={styles.highlighterCenter} style={{ left: center - left }} />
      </div>
      {tooltipContainer !== null &&
        createPortal(
          <div
            className={styles.tooltipContainer}
            style={{
              left: center,
            }}
          >
            <div className={styles.tooltip}>
              <span className={styles.tooltipDate}>{centerDateLabel}</span>
              {highlighterData.map((item, itemIndex) => {
                if (!item) return null
                else
                  return (
                    <span key={itemIndex} className={styles.tooltipItem}>
                      <span
                        className={styles.tooltipColor}
                        style={{ backgroundColor: item.color }}
                      ></span>
                      {item.labels?.map((label, labelIndex) => (
                        <span
                          key={labelIndex}
                          className={cx(styles.tooltipLabel, { [styles.isMain]: label?.isMain })}
                        >
                          {label?.value}
                        </span>
                      ))}
                    </span>
                  )
              })}
            </div>
          </div>,
          tooltipContainer
        )}
    </Fragment>
  )
}

export default Highlighter
