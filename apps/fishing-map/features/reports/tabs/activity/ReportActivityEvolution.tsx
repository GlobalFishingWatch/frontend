import type { ReactNode } from 'react'
import { cloneElement, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import max from 'lodash/max'
import min from 'lodash/min'
import type { DateTimeUnit } from 'luxon';
import { DateTime } from 'luxon'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { getContrastSafeColor } from '@globalfishingwatch/responsive-visualizations'

import { tickFormatter } from 'features/reports/report-area/area-reports.utils'
import type { ReportGraphProps } from 'features/reports/reports-timeseries.hooks'
import EvolutionGraphTooltip from 'features/reports/tabs/activity/EvolutionGraphTooltip'
import {
  formatDateTicks,
  formatEvolutionData,
} from 'features/reports/tabs/activity/reports-activity-timeseries.utils'

import styles from './ReportActivityEvolution.module.css'

const graphMargin = { top: 0, right: 0, left: -20, bottom: -10 }

export type EvolutionTooltipContentProps = {
  active: boolean
  payload?: any[]
  position?: { x: number; y: number }
  label?: string
}

const ReportActivityEvolution = ({
  data,
  start,
  end,
  TooltipContent,
  removeEmptyValues = false,
  freezeTooltipOnClick = false,
}: {
  data: ReportGraphProps
  start: string
  end: string
  TooltipContent?: ReactNode
  removeEmptyValues?: boolean
  freezeTooltipOnClick?: boolean
}) => {
  const [fixedTooltip, setFixedTooltip] = useState<EvolutionTooltipContentProps | null>(null)
  const hoverTooltipRef = useRef<EvolutionTooltipContentProps | null>(null)
  const chartRef = useRef<HTMLDivElement>(null)

  const colors = (data?.sublayers || []).map((sublayer) => sublayer?.legend?.color)?.join(',')
  const domain = useMemo(() => {
    if (start && end && data?.interval) {
      const interval = data.interval.toLowerCase() as DateTimeUnit
      const intervalStartDateTime = DateTime.fromISO(start, { zone: 'utc' }).startOf(interval)
      let intervalEndDateTime = DateTime.fromISO(end, { zone: 'utc' }).startOf(interval)
      if (intervalStartDateTime.toMillis() === intervalEndDateTime.toMillis()) {
        intervalEndDateTime = intervalEndDateTime.plus({ [interval]: 1 })
      }
      return [intervalStartDateTime.toMillis(), intervalEndDateTime.toMillis()]
    }
  }, [start, end, data?.interval])

  const dataFormated = useMemo(
    () => {
      return formatEvolutionData(data, {
        start: domain ? new Date(domain[0]).toISOString() : start,
        end: domain ? new Date(domain[1]).toISOString() : end,
        timeseriesInterval: data?.interval,
        removeEmptyValues,
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, end, start, colors]
  )

  const handleTooltipChange = useCallback(
    (tooltipProps: any) => {
      if (fixedTooltip) {
        return
      }
      if (tooltipProps?.active && tooltipProps?.payload) {
        hoverTooltipRef.current = {
          active: true,
          payload: tooltipProps.payload,
          position: tooltipProps.position,
          label: tooltipProps.label,
        }
      } else {
        hoverTooltipRef.current = null
      }
    },
    [fixedTooltip]
  )

  const handleTooltipClick = useCallback((tooltipProps: any) => {
    if (tooltipProps?.active && tooltipProps?.payload) {
      setFixedTooltip({
        active: true,
        payload: tooltipProps.payload,
        position: tooltipProps.coordinate,
        label: tooltipProps.label,
      })
    }
  }, [])

  const handleChartClick = useCallback(() => {
    if (freezeTooltipOnClick) {
      if (!fixedTooltip && hoverTooltipRef.current?.active && hoverTooltipRef.current?.payload) {
        setFixedTooltip(hoverTooltipRef.current)
      } else if (fixedTooltip) {
        setFixedTooltip(null)
      }
    }
  }, [fixedTooltip, freezeTooltipOnClick])

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (chartRef.current && !chartRef.current.contains(event.target as Node)) {
      setFixedTooltip(null)
    }
  }, [])

  useEffect(() => {
    if (fixedTooltip) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [fixedTooltip, handleClickOutside])

  if (!dataFormated || !domain) {
    return null
  }

  const dataMin: number = dataFormated.length
    ? (min(dataFormated.flatMap(({ range }) => range?.[0]?.[0])) as number)
    : 0
  const dataMax: number = dataFormated.length
    ? (max(dataFormated.flatMap(({ range }) => range?.[0]?.[1])) as number)
    : 0

  const basePadding = (dataMax - dataMin) / 10
  const safePadding = basePadding === 0 ? Math.max(1, Math.abs(dataMax) * 0.1) : basePadding
  const paddedDomain: [number, number] = [Math.max(0, dataMin - safePadding), dataMax + safePadding]

  return (
    <div
      className={styles.graph}
      data-test="report-activity-evolution"
      ref={chartRef}
      onClick={handleChartClick}
      role="button"
      tabIndex={0}
    >
      <ComposedChart responsive width="100%" height="100%" data={dataFormated} margin={graphMargin}>
        <CartesianGrid vertical={false} syncWithTicks />
        <XAxis
          domain={domain}
          dataKey="date"
          minTickGap={10}
          interval="preserveStartEnd"
          tickFormatter={(tick: string) => formatDateTicks(tick, data?.interval)}
          axisLine={paddedDomain[0] === 0}
        />
        <YAxis
          scale="linear"
          domain={paddedDomain}
          interval="preserveEnd"
          tickFormatter={tickFormatter}
          axisLine={false}
          tickLine={false}
        />
        {dataFormated?.length && (
          <Tooltip
            content={(tooltipProps: any) => {
              if (!tooltipProps) {
                return null
              }

              const tooltipContent = TooltipContent ? (
                cloneElement(TooltipContent as React.ReactElement, {
                  ...tooltipProps,
                  timeChunkInterval: data?.interval,
                })
              ) : (
                <EvolutionGraphTooltip {...tooltipProps} timeChunkInterval={data?.interval} />
              )

              if (!freezeTooltipOnClick) {
                return tooltipContent
              }

              if (tooltipProps && !fixedTooltip) {
                handleTooltipChange(tooltipProps)
              }
              return (
                <div
                  role="button"
                  tabIndex={0}
                  onMouseDown={(e) => {
                    e.stopPropagation()
                    if (tooltipProps) {
                      handleTooltipClick(tooltipProps)
                    }
                  }}
                >
                  {tooltipContent}
                </div>
              )
            }}
            active={fixedTooltip ? fixedTooltip.active : undefined}
            position={
              fixedTooltip?.position
                ? { x: fixedTooltip.position.x, y: fixedTooltip.position.y }
                : undefined
            }
            cursor={fixedTooltip ? false : true}
          />
        )}
        {fixedTooltip?.label && (
          <ReferenceLine
            x={new Date(fixedTooltip.label).getTime()}
            stroke="#163f89"
            strokeDasharray="3 3"
          />
        )}
        {data?.sublayers.map(({ id, legend }, index) => (
          <Line
            key={`${id}-${index}-line`}
            name="line"
            type="monotone"
            dataKey={(data) => data.avg?.[index]}
            unit={legend?.unit}
            dot={removeEmptyValues}
            isAnimationActive={false}
            stroke={getContrastSafeColor(legend?.color as string)}
            strokeWidth={2}
          />
        ))}
        {data?.sublayers.map(({ id, legend }, index) => (
          <Area
            key={`${id}-${index}-area`}
            name="area"
            type="monotone"
            dataKey={(data) => data.range?.[index]}
            activeDot={false}
            fill={legend?.color}
            stroke="none"
            fillOpacity={0.2}
            isAnimationActive={false}
          />
        ))}
      </ComposedChart>
    </div>
  )
}

export default ReportActivityEvolution
