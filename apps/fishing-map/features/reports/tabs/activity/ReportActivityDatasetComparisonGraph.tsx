import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import max from 'lodash/max'
import min from 'lodash/min'
import { DateTime } from 'luxon'
import {
  CartesianGrid,
  Line,
  LineChart,
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

import { DATASET_COMPARISON_SUFFIX, LAYER_LIBRARY_ID_SEPARATOR } from 'data/config'
import { LAYERS_LIBRARY_ENVIRONMENT } from 'data/layer-library/layers-environment'
import { TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG } from 'data/workspaces'
import { useAppDispatch } from 'features/app/app.hooks'
import i18n from 'features/i18n/i18n'
import { tickFormatter } from 'features/reports/report-area/area-reports.utils'
import { selectReportComparisonDataviewIds } from 'features/reports/reports.config.selectors'
import type { ReportGraphProps } from 'features/reports/reports-timeseries.hooks'
import {
  formatComparisonEvolutionData,
  formatEvolutionData,
} from 'features/reports/tabs/activity/reports-activity-timeseries.utils'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useLocationConnect } from 'routes/routes.hook'
import { getUTCDateTime } from 'utils/dates'

import EvolutionGraphTooltip from './EvolutionGraphTooltip'
import { resetReportData } from './reports-activity.slice'

import activityStyles from './ReportActivity.module.css'
import styles from './ReportActivityEvolution.module.css'

const formatDateTicks = (tick: string, timeChunkInterval: FourwingsInterval) => {
  const date = getUTCDateTime(tick).setLocale(i18n.language)
  return formatDateForInterval(date, timeChunkInterval)
}

const graphMargin = { top: 0, right: 0, left: -20, bottom: -10 }

export type ReportActivityDatasetComparisonProps = {
  data: ReportGraphProps[]
  start: string
  end: string
}

const ReportActivityDatasetComparisonGraph = ({
  data,
  start,
  end,
}: ReportActivityDatasetComparisonProps) => {
  const { t } = useTranslation('layer-library')
  const { dispatchQueryParams } = useLocationConnect()
  const dispatch = useAppDispatch()

  const comparedDataset = useSelector(selectReportComparisonDataviewIds)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()

  const environmentalLayerOptions = useMemo(() => {
    return LAYERS_LIBRARY_ENVIRONMENT.filter(
      (layer) => layer?.dataviewId === TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG
    ).flatMap((layer) => {
      return {
        id: layer?.id || '',
        label: t(`${layer.id}.name`),
      }
    })
  }, [t])

  const colors = data.map((layer) => layer.sublayers[0]?.legend?.color)?.join(',')
  const dataFormated = useMemo(() => formatComparisonEvolutionData(data), [colors])
  console.log('🚀 ~ ReportActivityDatasetComparisonGraph ~ dataFormated:', dataFormated)

  const domain = useMemo(() => {
    if (start && end && data[0]?.interval) {
      const cleanEnd = DateTime.fromISO(end, { zone: 'utc' })
        .minus({ [data[0]?.interval]: 1 })
        .toISO() as string
      return [new Date(start).getTime(), new Date(cleanEnd).getTime()]
    }
  }, [start, end, data[0]?.interval])

  if (!dataFormated || !domain) {
    return null
  }

  const dataMin: number = dataFormated.length
    ? (min(dataFormated.filter((d) => d !== null).flatMap(({ range }) => range[0][0])) as number)
    : 0
  const dataMax: number = dataFormated.length
    ? (max(dataFormated.filter((d) => d !== null).flatMap(({ range }) => range[0][1])) as number)
    : 0

  const domainPadding = (dataMax - dataMin) / 10
  const paddedDomain: [number, number] = [
    Math.max(0, Math.floor(dataMin - domainPadding)),
    Math.ceil(dataMax + domainPadding),
  ]

  const onSelect = (option: SelectOption) => {
    dispatch(resetReportData())
    const layerConfig = LAYERS_LIBRARY_ENVIRONMENT.find((layer) => layer.id === option.id)
    if (!layerConfig) return
    const dataviewID = `${option.id}${LAYER_LIBRARY_ID_SEPARATOR}${DATASET_COMPARISON_SUFFIX}`
    const { category, dataviewId, datasetsConfig, config } = layerConfig
    upsertDataviewInstance({
      id: dataviewID,
      category,
      dataviewId,
      datasetsConfig,
      config: {
        ...config,
        visible: true,
      },
    })
    dispatchQueryParams({
      reportComparisonDataviewIds: [dataviewID],
    })
  }

  const selectedDataview = comparedDataset?.map((id) => id.split(LAYER_LIBRARY_ID_SEPARATOR)[0])
  const selectedComparedDataset = environmentalLayerOptions.find((layer) =>
    selectedDataview?.includes(layer.id)
  )

  return (
    <div className={styles.graph} data-test="report-activity-dataset-comparison">
      <div className={activityStyles.titleRow}>
        <Select
          options={data.map((layer) => ({
            id: layer.sublayers[0].id,
            label: layer.sublayers[0].id || '',
          }))}
          onSelect={onSelect} //implement later to change main dataset
          selectedOption={
            data[0]?.sublayers[0] && {
              id: data[0].sublayers[0].id,
              label: data[0].sublayers[0].id || '',
            }
          }
          disabled
          className={activityStyles.select}
        />
        <Select
          options={environmentalLayerOptions}
          selectedOption={selectedComparedDataset}
          onSelect={onSelect}
          className={activityStyles.select}
        />
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={dataFormated} margin={graphMargin}>
          <CartesianGrid vertical={false} syncWithTicks />
          <XAxis
            domain={domain}
            dataKey="date"
            minTickGap={10}
            tickFormatter={(tick: string) => formatDateTicks(tick, data[0]?.interval)}
            axisLine={paddedDomain[0] === 0}
          />

          {data.map((layer) => {
            return layer?.sublayers.map(({ id, legend }, index) => {
              const strokeColor = getContrastSafeLineColor(legend?.color as string)
              return (
                <>
                  <YAxis
                    scale="linear"
                    domain={paddedDomain}
                    interval="preserveEnd"
                    tickFormatter={tickFormatter}
                    tick={{ stroke: strokeColor, strokeWidth: 0.5 }}
                    axisLine={{ stroke: strokeColor }}
                    tickLine={false}
                    orientation={index % 2 === 0 ? 'left' : 'right'}
                    yAxisId={index % 2 === 0 ? 'left' : 'right'}
                  />
                  <Line
                    key={`${id}-${index}-line`}
                    yAxisId={index % 2 === 0 ? 'left' : 'right'}
                    name="line"
                    type="monotone"
                    dataKey={(data) => data.avg?.[index]}
                    unit={legend?.unit}
                    dot={false}
                    isAnimationActive={false}
                    stroke={strokeColor}
                    strokeWidth={2}
                  />
                </>
              )
            })
          })}
          {dataFormated?.length && (
            <Tooltip content={<EvolutionGraphTooltip timeChunkInterval={data[0]?.interval} />} />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ReportActivityDatasetComparisonGraph
