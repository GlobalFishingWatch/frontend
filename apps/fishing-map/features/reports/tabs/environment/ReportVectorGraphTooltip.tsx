import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import * as d3 from 'd3'
import max from 'lodash/max'

import type { FourwingsFeature, FourwingsInterval } from '@globalfishingwatch/deck-loaders'

import { PRIMARY_BLUE_COLOR } from 'data/config'
import i18n from 'features/i18n/i18n'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { formatDate } from 'features/reports/report-area/area-reports.utils'
import { useReportFilteredFeatures } from 'features/reports/reports-timeseries.hooks'
import type { EvolutionTooltipContentProps } from 'features/reports/tabs/activity/ReportActivityEvolution'
import { getUTCDateTime } from 'utils/dates'

import styles from '../activity/ReportActivityEvolution.module.css'

type TooltipData = {
  direction: number
  count: number
  force: number
  x: number
  y: number
} | null

const DEGREES_BINNED = 10
const SIZE = 160
const MARGIN = 20
const RADIUS = SIZE / 2 - MARGIN
const INNER_RADIUS = 10
const CARDINAL_LABEL_OFFSET = 10

function metersPerSecondToKnots(speedInMps: number): number {
  return speedInMps * 1.94384 // Convert m/s to knots
}

function ReportVectorGraphTooltip(
  props: Partial<EvolutionTooltipContentProps> & {
    instanceId: string
    color?: string
    timeChunkInterval?: FourwingsInterval
  }
) {
  const { t } = useTranslation()
  const [tooltip, setTooltip] = useState<TooltipData>(null)
  const { instanceId, color = PRIMARY_BLUE_COLOR, timeChunkInterval, payload } = props
  const hoveredTime = payload?.[0]?.payload?.date
  const features = useReportFilteredFeatures()

  const data = useMemo(() => {
    const featuresFiltered = features?.find((f) => f.some((f) => f.instanceId === instanceId))?.[0]
      ?.contained as FourwingsFeature[]
    return featuresFiltered.flatMap((f) => {
      const dateIndex = f.properties.dates?.[0]?.findIndex((date) => date === hoveredTime)
      if (dateIndex === -1) return []
      return {
        direction: f.properties.directions?.[dateIndex],
        velocity: f.properties.velocities?.[dateIndex],
      }
    })
  }, [features, instanceId, hoveredTime])

  const dataFormated = useMemo(() => {
    // Store force sums and counts for each degree bin
    const directions: { [key: number]: { force: number; count: number } } = {}
    data?.forEach((feature) => {
      const rawDirection = -270 - Math.round(feature.direction || 0)
      const direction = Math.abs((Math.round(rawDirection / DEGREES_BINNED) * DEGREES_BINNED) % 360)
      const force = feature.velocity || 0
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
      .range([INNER_RADIUS + 1, RADIUS])

    const bar = d3.arc().innerRadius(INNER_RADIUS)

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
  const date = getUTCDateTime(hoveredTime).setLocale(i18n.language)
  const formattedLabel = formatDate(date, timeChunkInterval || 'DAY')
  const center = SIZE / 2
  const outerRadius = RADIUS
  const cardinalOffset = CARDINAL_LABEL_OFFSET

  return (
    <div
      className={styles.tooltipContainer}
      data-test="report-currents"
      style={{ position: 'relative' }}
    >
      <p className={styles.tooltipLabel}>{formattedLabel}</p>
      <p>
        <span className={styles.tooltipValueDot} style={{ color }}></span>
        {payload?.[0].value && (
          <span>
            {formatI18nNumber(payload?.[0].value, { maximumFractionDigits: 2 })}
            {payload?.[0]?.unit ? ` ${payload?.[0]?.unit}` : ''}
          </span>
        )}
      </p>
      <label className={cx(styles.tooltipLabel, styles.margin)}>{t('common.directions')}</label>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {/* Background circles */}
        {new Array(4).fill(0).map((_, i, array) => (
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={INNER_RADIUS + ((RADIUS - INNER_RADIUS) / (array.length - 1)) * i}
            fill="none"
            className={styles.line}
          />
        ))}
        {/* Cardinal directions */}
        <g className={styles.labels}>
          <text
            x={center}
            y={center - outerRadius - cardinalOffset + 5}
            textAnchor="middle"
            className={styles.cardinalDirection}
          >
            {t('common.cardinalNorth')}
          </text>
          <line
            x1={center}
            y1={center - outerRadius}
            x2={center}
            y2={center - INNER_RADIUS}
            className={styles.line}
          />

          <text
            x={center + outerRadius + cardinalOffset}
            y={center + 4}
            textAnchor="middle"
            className={styles.cardinalDirection}
          >
            {t('common.cardinalEast')}
          </text>
          <line
            x1={center + INNER_RADIUS}
            y1={center}
            x2={center + outerRadius}
            y2={center}
            className={styles.line}
          />

          <text
            x={center}
            y={center + outerRadius + cardinalOffset + 4}
            textAnchor="middle"
            className={styles.cardinalDirection}
          >
            {t('common.cardinalSouth')}
          </text>
          <line
            x1={center}
            y1={center + INNER_RADIUS}
            x2={center}
            y2={center + outerRadius}
            className={styles.line}
          />

          <text
            x={center - outerRadius - cardinalOffset}
            y={center + 4}
            textAnchor="middle"
            className={styles.cardinalDirection}
          >
            {t('common.cardinalWest')}
          </text>
          <line
            x1={center - outerRadius}
            y1={center}
            x2={center - INNER_RADIUS}
            y2={center}
            className={styles.line}
          />
        </g>

        {polarBars}

        {tooltip && data?.length && data.length > 0 && (
          <g className={styles.labels}>
            <text x={SIZE / 2} y={SIZE / 2 - 14} textAnchor="middle">
              {/* TODO: Fix angles and display as xN, yE... */}
              {tooltip.direction}°
            </text>
            <text x={SIZE / 2} y={SIZE / 2 + 6} textAnchor="middle">
              {formatI18nNumber((tooltip.count / data?.length) * 100, {
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
    </div>
  )
}

export default ReportVectorGraphTooltip
