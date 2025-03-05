import { Fragment, useContext, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import cx from 'classnames'
import { useAtomValue } from 'jotai'
import { DateTime } from 'luxon'

import { getUTCDate } from '@globalfishingwatch/data-transforms'
import type { IconType } from '@globalfishingwatch/ui-components'
import { Icon } from '@globalfishingwatch/ui-components'

import type { TimelineScale } from '../timelineContext'
import TimelineContext from '../timelineContext'
import { getDefaultFormat } from '../utils/internal-utils'

import { useOuterScale } from './common/hooks'
import type {
  ChartType,
  HighlightedChunks,
  HighlighterDateCallback,
  TimebarChartChunk,
  TimebarChartItem,
  TimebarChartsData,
} from './common/types'
import chartsDataState, { hoveredEventState } from './chartsData.atom'

import styles from './highlighter.module.css'

const getCoords = (
  hoverStart: string,
  hoverEnd: string,
  outerScale: TimelineScale,
  dateCallback?: HighlighterDateCallback
) => {
  const hoverStartDate = getUTCDate(hoverStart)
  const hoverEndDate = getUTCDate(hoverEnd)
  const left = outerScale(hoverStartDate)
  const width = outerScale(hoverEndDate) - left
  const centerMs = Math.round(
    hoverStartDate.getTime() + (hoverEndDate.getTime() - hoverStartDate.getTime()) / 2
  )
  const centerDate = getUTCDate(centerMs)
  const center = outerScale(centerDate)

  let dateLabel
  if (dateCallback) dateLabel = dateCallback(centerMs)
  else {
    const format = getDefaultFormat(hoverStart, hoverEnd)
    dateLabel = DateTime.fromJSDate(centerDate, { zone: 'utc' }).toFormat(format)
  }
  return {
    left,
    center,
    width,
    centerMs,
    dateLabel,
  }
}

const findChunks = (
  centerMs: number,
  item: TimebarChartItem,
  minHighlightChunkDuration: number
) => {
  if (!item?.chunks?.length) {
    return []
  }
  const foundChunks = item.chunks.filter((chunk: TimebarChartChunk, chunkIndex: number) => {
    const chunkEnd = chunk.end || item.chunks[chunkIndex + 1]?.start || Number.NEGATIVE_INFINITY
    const delta = chunkEnd - chunk.start

    if (delta > minHighlightChunkDuration && chunk.end) {
      return centerMs > chunk.start && centerMs < chunkEnd
    }

    const center = chunk.start + delta / 2
    const bufferedStart = center - minHighlightChunkDuration / 2
    const bufferedEnd = center + minHighlightChunkDuration / 2
    return centerMs > bufferedStart && centerMs < bufferedEnd
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
  expanded?: boolean
  labels: ({ value?: string } | undefined)[]
  color?: string
  icon?: string
  defaultLabel?: { value?: string }
}

const getHighlighterData = (
  centerMs: number,
  minHighlightChunkDuration: number,
  dataRecord?: TimebarChartsData,
  hoveredEventId?: string
) => {
  if (!dataRecord) return { highlighterData: [] }
  const data = Object.entries(dataRecord)
  if (!data.length) return { highlighterData: [] }

  let highlighterData: HighlighterData[] = []
  const highlightedChunks: HighlightedChunks = {}

  data.forEach((chart, chartIndex) => {
    const chartType = chart[0] as ChartType
    const chartData = chart[1]
    if (!chartData.active) return
    highlightedChunks[chartType] = []
    chartData.data?.forEach((item, itemIndex) => {
      const foundChunks = findChunks(centerMs, item, minHighlightChunkDuration)

      // Case where several track events overlap (reverse order as this is paint order)
      const foundChunk = foundChunks ? foundChunks[foundChunks.length - 1] : undefined

      if (!highlighterData[itemIndex]) {
        highlighterData[itemIndex] = {
          color: item.color,
          labels: [],
        }
      }

      if (foundChunk) {
        const expanded = foundChunk.id === hoveredEventId
        if (chartType === 'tracksEvents' || chartType === 'tracksGraphs') {
          highlighterData[itemIndex].expanded = expanded
        }
        if (item.defaultLabel && !highlighterData[itemIndex].defaultLabel) {
          highlighterData[itemIndex].defaultLabel = {
            value: item.defaultLabel,
          }
        }
        const foundValue = findValue(centerMs, foundChunk)

        const callbacksArgs = {
          chunk: foundChunk,
          value: foundValue,
          item,
          itemIndex,
          expanded,
        }

        const label = item.getHighlighterLabel
          ? typeof item.getHighlighterLabel === 'string'
            ? item.getHighlighterLabel
            : item.getHighlighterLabel(callbacksArgs)
          : foundValue?.value?.toString()

        if (label) {
          highlighterData[itemIndex].labels[chartIndex] = {
            value: label,
          }
        }

        const icon = item.getHighlighterIcon
          ? typeof item.getHighlighterIcon === 'string'
            ? item.getHighlighterIcon
            : item.getHighlighterIcon(callbacksArgs)
          : ''

        highlighterData[itemIndex].icon = icon

        if (foundChunk.cluster?.ids) {
          highlightedChunks[chartType] = highlightedChunks[chartType]?.concat(
            foundChunk.cluster?.ids || []
          )
        } else if (foundChunk.id) {
          highlightedChunks[chartType] = highlightedChunks[chartType]?.concat([
            foundChunk.id as string,
          ])
        }
      }
    })
  })

  highlighterData = highlighterData.flatMap((item) => {
    if (!item.defaultLabel && item.labels?.every((l) => !l?.value)) return []
    return item
  })

  return { highlighterData, highlightedChunks }
}

const Highlighter = ({
  hoverStart,
  hoverEnd,
  onHighlightChunks,
  dateCallback,
  showTooltip = true,
}: {
  hoverStart: string
  hoverEnd: string
  onHighlightChunks?: (data?: HighlightedChunks) => any
  dateCallback?: HighlighterDateCallback
  showTooltip?: boolean
}) => {
  const { graphHeight, tooltipContainer, outerStart, outerEnd } = useContext(TimelineContext)
  const outerScale = useOuterScale()
  const { width, left, center, centerMs, dateLabel } = useMemo(
    () => getCoords(hoverStart, hoverEnd, outerScale, dateCallback),
    [hoverStart, hoverEnd, outerScale, dateCallback]
  )

  // TODO Filter active with selector
  const chartsData = useAtomValue(chartsDataState)
  const hoveredEventId = useAtomValue(hoveredEventState)

  const minHighlightChunkDuration = useMemo(() => {
    return +outerScale.invert(15) - +outerScale.invert(0)
  }, [outerStart, outerEnd])

  const { highlighterData, highlightedChunks } = useMemo(() => {
    return getHighlighterData(centerMs, minHighlightChunkDuration, chartsData, hoveredEventId)
  }, [centerMs, chartsData, minHighlightChunkDuration, hoveredEventId])

  useEffect(() => {
    if (onHighlightChunks) {
      onHighlightChunks(highlightedChunks)
    }
  }, [highlightedChunks, onHighlightChunks])

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
        showTooltip &&
        createPortal(
          <div
            className={styles.tooltipContainer}
            style={{
              left: center,
            }}
          >
            <div
              className={cx(styles.tooltip, {
                [styles.overflowRight]: window.innerWidth - center < 700,
              })}
            >
              <span className={styles.tooltipDate}>{dateLabel}</span>
              {highlighterData?.length > 0 && (
                <ul>
                  {highlighterData.map((item, itemIndex) => {
                    if (!item) return null
                    else
                      return (
                        <li
                          key={itemIndex}
                          className={cx(styles.tooltipItem, {
                            [styles.expanded]: item.expanded && highlighterData.length > 1,
                          })}
                        >
                          {item.icon ? (
                            <Icon icon={item.icon as IconType} style={{ color: item.color }}></Icon>
                          ) : (
                            <span
                              className={styles.tooltipColor}
                              style={{ backgroundColor: item.color }}
                            ></span>
                          )}
                          <div>
                            {item.defaultLabel && (
                              <span className={cx(styles.tooltipLabel, styles.isMain)}>
                                {item.defaultLabel.value}
                              </span>
                            )}
                            {item.labels?.map((label, labelIndex) => (
                              <span key={labelIndex} className={cx(styles.tooltipLabel)}>
                                {label?.value}
                              </span>
                            ))}
                          </div>
                        </li>
                      )
                  })}
                </ul>
              )}
            </div>
          </div>,
          tooltipContainer
        )}
    </Fragment>
  )
}

export default Highlighter
