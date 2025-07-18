import React, { useMemo, useState } from 'react'
import * as d3 from 'd3'
import max from 'lodash/max'

import { formatI18nNumber } from 'features/i18n/i18nNumber'
import type { FilteredPolygons } from 'features/reports/tabs/activity/reports-activity-geo.utils'

import styles from './ReportActivityEvolution.module.css'

export type ReportCurrentsProps = {
  data: FilteredPolygons[]
  color?: string
}

type TooltipData = {
  direction: number
  count: number
  force: number
  x: number
  y: number
} | null

const DEGREES_BINNED = 10
const SIZE = 300
const MARGIN = 30
const RADIUS = SIZE / 2 - MARGIN

function metersPerSecondToKnots(speedInMps: number): number {
  return speedInMps * 1.94384 // Convert m/s to knots
}

function ReportCurrentsGraph({ data, color }: ReportCurrentsProps) {
  const [tooltip, setTooltip] = useState<TooltipData>(null)

  const dataFormated = useMemo(() => {
    // Store force sums and counts for each degree bin
    const directions: { [key: number]: { force: number; count: number } } = {}
    data?.[0].contained.forEach((feature) => {
      const rawDirection = -270 - Math.round(feature.aggregatedValues?.[1] || 0)
      const direction = Math.abs((Math.round(rawDirection / DEGREES_BINNED) * DEGREES_BINNED) % 360)
      const force = feature.aggregatedValues?.[0] || 0
      if (!directions[direction]) {
        directions[direction] = { force: 0, count: 0 }
      }
      directions[direction].force += force
      directions[direction].count++
    })

    return Object.entries(directions).map(([directionKey, directionValue]) => ({
      direction: parseInt(directionKey),
      force: directionValue.force / directionValue.count,
      count: directionValue.count,
    }))
  }, [data])

  const polarBars = useMemo(() => {
    if (!dataFormated?.length) return null

    const barScale = d3
      .scaleLinear()
      .domain([0, max(dataFormated.map((d) => d.count)) || 0])
      .range([RADIUS / 2 + 1, RADIUS])

    const bar = d3.arc().innerRadius(RADIUS / 2)

    return dataFormated.map((d) => {
      const length = barScale(d.count)
      const startAngle = ((d.direction - DEGREES_BINNED / 2) * Math.PI) / 180 + 90
      const endAngle = ((d.direction + DEGREES_BINNED / 2) * Math.PI) / 180 + 90
      return (
        <path
          key={d.direction}
          transform={`translate(${SIZE / 2}, ${SIZE / 2})`}
          onMouseEnter={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            setTooltip({
              direction: d.direction,
              force: metersPerSecondToKnots(d.force),
              count: d.count,
              x: rect.x + rect.width / 2,
              y: rect.y,
            })
          }}
          onMouseLeave={() => setTooltip(null)}
          d={bar.outerRadius(length).startAngle(startAngle).endAngle(endAngle)(d as any) || ''}
          fill={color}
          className={styles.curentsArc}
        />
      )
    })
  }, [color, dataFormated])

  if (!dataFormated?.length) {
    return null
  }

  return (
    <div className={styles.graph} data-test="report-currents" style={{ position: 'relative' }}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {/* Background circles */}
        {new Array(4).fill(0).map((_, i, array) => (
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS / 2 + (RADIUS / 2 / (array.length - 1)) * i}
            fill="none"
            className={styles.line}
          />
        ))}
        {/* Cardinal directions */}
        <g className={styles.labels}>
          <text x={SIZE / 2} y={20} textAnchor="middle">
            N
          </text>
          <line
            x1={SIZE / 2}
            y1={MARGIN}
            x2={SIZE / 2}
            y2={SIZE / 2 - RADIUS / 2}
            className={styles.line}
          />

          <text x={SIZE - 15} y={SIZE / 2 + 6} textAnchor="start">
            E
          </text>
          <line
            x1={SIZE / 2 + RADIUS / 2}
            y1={SIZE / 2}
            x2={SIZE - MARGIN}
            y2={SIZE / 2}
            className={styles.line}
          />

          <text x={SIZE / 2} y={SIZE - 10} textAnchor="middle">
            S
          </text>
          <line
            x1={SIZE / 2}
            y1={SIZE / 2 + RADIUS / 2}
            x2={SIZE / 2}
            y2={SIZE - MARGIN}
            className={styles.line}
          />

          <text x={15} y={SIZE / 2 + 6} textAnchor="end">
            W
          </text>
          <line
            x1={MARGIN}
            y1={SIZE / 2}
            x2={SIZE / 2 - RADIUS / 2}
            y2={SIZE / 2}
            className={styles.line}
          />
        </g>

        {polarBars}

        {tooltip && (
          <g className={styles.labels}>
            <text x={SIZE / 2} y={SIZE / 2 - 14} textAnchor="middle">
              {/* TODO: Fix angles and display as xN, yE... */}
              {tooltip.direction}°
            </text>
            <text x={SIZE / 2} y={SIZE / 2 + 6} textAnchor="middle">
              {formatI18nNumber((tooltip.count / data?.[0].contained.length) * 100, {
                maximumFractionDigits: 2,
              })}
              % of area
            </text>
            <text x={SIZE / 2} y={SIZE / 2 + 26} textAnchor="middle">
              {formatI18nNumber(tooltip.force, { maximumFractionDigits: 2 })} knots
            </text>
          </g>
        )}
      </svg>
      {/* {tooltip && (
        <div
          style={{ pointerEvents: 'none', position: 'absolute', top: tooltip.y, left: tooltip.x }}
        >
          <div className={styles.tooltipContainer}>
            <div className={styles.tooltipValue}>
              <span>Direction: {tooltip.direction}°</span>
            </div>
            <div className={styles.tooltipValue}>
              <span>Count: {tooltip.count}</span>
            </div>
            <div className={styles.tooltipValue}>
              <span>Force: {formatI18nNumber(tooltip.force, { maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      )} */}
    </div>
  )
}

export default ReportCurrentsGraph
