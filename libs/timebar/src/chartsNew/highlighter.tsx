import { Fragment, useContext, useMemo } from 'react'
import { createPortal } from 'react-dom'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import cx from 'classnames'
import { useRecoilValue } from 'recoil'
import TimelineContext, { TimelineScale } from '../timelineContext'
import { getDefaultFormat } from '../utils/internal-utils'
import styles from './highlighter.module.css'
import {
  TimebarChartData,
  TimebarChartChunk,
  TimebarChartItem,
  TimebarChartsData,
} from './common/types'
import chartsDataState from './chartsData.atom'

dayjs.extend(utc)

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

const findChunks = (centerMs: number, item: TimebarChartItem) => {
  const foundChunks = item.chunks.filter((chunk: TimebarChartChunk, chunkIndex: number) => {
    const chunkEnd = chunk.end || item.chunks[chunkIndex + 1]?.start || Number.NEGATIVE_INFINITY
    return centerMs > chunk.start && centerMs < chunkEnd
  })
  return foundChunks
}

const findValue = (centerMs: number, chunk: TimebarChartChunk) => {
  if (!chunk.values) return undefined
  const foundValue = chunk.values.find((value, valueIndex) => {
    if (!chunk.values) return false
    const values = chunk.values[valueIndex + 1]
    const valueEnd = values?.timestamp || chunk.end || Number.NEGATIVE_INFINITY
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
  dataRecord?: TimebarChartsData
): (HighlighterData | undefined)[] => {
  if (!dataRecord) return []
  const data = Object.entries(dataRecord)
  if (!data.length) return []

  let highlighterData: (HighlighterData | undefined)[] = data[0][1].map((mainItem) => {
    return {
      color: mainItem.color,
      labels: [],
    }
  })

  data.forEach((chart, chartIndex) => {
    const chartData = chart[1]
    chartData.forEach((item, itemIndex) => {
      const foundChunks = findChunks(centerMs, item)
      // TODO Case where several track events overlap. Right now prioritized by type (encounter first etc) but should we display them all
      const foundChunk = foundChunks ? foundChunks[0] : undefined
      let label = undefined
      if (foundChunk) {
        const foundValue = findValue(centerMs, foundChunk)
        label = item.getHighlighterLabel
          ? typeof item.getHighlighterLabel === 'string'
            ? item.getHighlighterLabel
            : item.getHighlighterLabel(foundChunk, foundValue)
          : foundValue?.value?.toString()
      }
      if (label) {
        highlighterData[itemIndex]!.labels![chartIndex] = {
          value: label,
          isMain: chartIndex === 0 && data.length > 1,
        }
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

const Highlighter = ({ hoverStart, hoverEnd }: { hoverStart: string; hoverEnd: string }) => {
  const { outerScale, graphHeight, tooltipContainer } = useContext(TimelineContext)
  const { width, left, center, centerMs, centerDateLabel } = useMemo(
    () => getCoords(hoverStart, hoverEnd, outerScale),
    [hoverStart, hoverEnd, outerScale]
  )

  const chartsData = useRecoilValue(chartsDataState)

  const highlighterData = useMemo(() => {
    return getHighlighterData(centerMs, chartsData)
  }, [centerMs, chartsData])

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
