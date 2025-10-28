import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import max from 'lodash/max'
import min from 'lodash/min'
import { DateTime } from 'luxon'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { formatDateForInterval } from '@globalfishingwatch/data-transforms'
import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { getContrastSafeLineColor } from '@globalfishingwatch/responsive-visualizations'
import type { SelectOption } from '@globalfishingwatch/ui-components'
import { Select } from '@globalfishingwatch/ui-components'

import { LAYERS_LIBRARY_ENVIRONMENT } from 'data/layer-library/layers-environment'
import { selectAllDataviews } from 'features/dataviews/dataviews.slice'
import i18n from 'features/i18n/i18n'
import { tickFormatter } from 'features/reports/report-area/area-reports.utils'
import type { ComparisonGraphData } from 'features/reports/tabs/activity/ReportActivityPeriodComparisonGraph'
import { formatEvolutionData } from 'features/reports/tabs/activity/reports-activity-timeseries.utils'
import { getUTCDateTime } from 'utils/dates'

import EvolutionGraphTooltip from './EvolutionGraphTooltip'

import activityStyles from './ReportActivity.module.css'
import styles from './ReportActivityEvolution.module.css'

interface ComparisonGraphProps {
  timeseries: ComparisonGraphData[]
  sublayers: {
    id: string
    legend: {
      color?: string
      unit?: string
    }
  }[]
  interval: FourwingsInterval
}

const formatDateTicks = (tick: string, timeChunkInterval: FourwingsInterval) => {
  const date = getUTCDateTime(tick).setLocale(i18n.language)
  return formatDateForInterval(date, timeChunkInterval)
}

const graphMargin = { top: 0, right: 0, left: -20, bottom: -10 }

const ReportActivityDatasetComparisonGraph = ({
  data,
  start,
  end,
}: {
  data: ComparisonGraphProps
  start: string
  end: string
}) => {
  const [comparedDataset, setComparedDataset] = useState<SelectOption>()
  const dataviews = useSelector(selectAllDataviews)

  const layers = useMemo(() => {
    return LAYERS_LIBRARY_ENVIRONMENT.flatMap((layer) =>
      dataviews.find((d) => d.slug === layer.dataviewId)
    )
  }, [dataviews])

  const colors = (data.sublayers || []).map((sublayer) => sublayer?.legend?.color)?.join(',')
  const dataFormated = useMemo(
    () => formatEvolutionData(data, { start, end, timeseriesInterval: data?.interval }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, end, start, colors]
  )
  const domain = useMemo(() => {
    if (start && end && data?.interval) {
      const cleanEnd = DateTime.fromISO(end, { zone: 'utc' })
        .minus({ [data?.interval]: 1 })
        .toISO() as string
      return [new Date(start).getTime(), new Date(cleanEnd).getTime()]
    }
  }, [start, end, data?.interval])

  if (!dataFormated || !domain) {
    return null
  }

  const dataMin: number = dataFormated.length
    ? (min(dataFormated.flatMap(({ range }) => range[0][0])) as number)
    : 0
  const dataMax: number = dataFormated.length
    ? (max(dataFormated.flatMap(({ range }) => range[0][1])) as number)
    : 0

  const domainPadding = (dataMax - dataMin) / 10
  const paddedDomain: [number, number] = [
    Math.max(0, Math.floor(dataMin - domainPadding)),
    Math.ceil(dataMax + domainPadding),
  ]

  const onSelect = (option: SelectOption) => {
    setComparedDataset(option)
  }

  return (
    <div className={styles.graph} data-test="report-activity-dataset-comparison">
      <div className={activityStyles.titleRow}>
        <Select
          options={data?.sublayers.map((sublayer) => ({
            id: sublayer.id,
            label: sublayer.id || '',
          }))}
          selectedOption={data?.sublayers
            .map((sublayer) => ({
              id: sublayer.id,
              label: sublayer.id || '',
            }))
            .find((o) => o.id === comparedDataset?.id)}
          onSelect={onSelect}
        />
        <Select
          options={layers.map((l) => ({
            id: l?.id || '',
            label: l?.name || '',
          }))}
          selectedOption={comparedDataset}
          onSelect={onSelect}
        />
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={dataFormated} margin={graphMargin}>
          <CartesianGrid vertical={false} syncWithTicks />
          <XAxis
            domain={domain}
            dataKey="date"
            minTickGap={10}
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
            <Tooltip content={<EvolutionGraphTooltip timeChunkInterval={data?.interval} />} />
          )}
          {data?.sublayers.map(({ id, legend }, index) => (
            <Line
              key={`${id}-${index}-line`}
              name="line"
              type="monotone"
              dataKey={(data) => data.avg?.[index]}
              unit={legend?.unit}
              dot={false}
              isAnimationActive={false}
              stroke={getContrastSafeLineColor(legend?.color as string)}
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
      </ResponsiveContainer>
    </div>
  )
}

export default ReportActivityDatasetComparisonGraph
