import { useRef } from 'react'

import { getIsIndividualTimeseriesSupported } from '../../lib/density'
import type { ResponsiveVisualizationData } from '../../types'
import {
  DEFAULT_AGGREGATED_ITEM_KEY,
  DEFAULT_DATE_KEY,
  DEFAULT_INDIVIDUAL_ITEM_KEY,
} from '../config'
import { useResponsiveVisualization, useValueKeys } from '../hooks'
import TimeseriesPlaceholder from '../placeholders/TimeseriesPlaceholder'
import type { BaseResponsiveChartProps, BaseResponsiveTimeseriesProps } from '../types'

import { AggregatedTimeseries } from './TimeseriesAggregated'
import { IndividualTimeseries } from './TimeseriesIndividual'

import styles from './Timeseries.module.css'

type ResponsiveTimeseriesProps = BaseResponsiveChartProps &
  BaseResponsiveTimeseriesProps & {
    dateKey?: keyof ResponsiveVisualizationData[0]
  }

export function ResponsiveTimeseries({
  start,
  end,
  dateKey = DEFAULT_DATE_KEY,
  aggregatedValueKey = DEFAULT_AGGREGATED_ITEM_KEY,
  individualValueKey = DEFAULT_INDIVIDUAL_ITEM_KEY,
  timeseriesInterval,
  getIndividualData,
  getAggregatedData,
  color,
  tickLabelFormatter,
  aggregatedTooltip,
  individualTooltip,
  onIndividualItemClick,
  onAggregatedItemClick,
  individualIcon,
}: ResponsiveTimeseriesProps) {
  const aggregatedValueKeys = useValueKeys(aggregatedValueKey)
  const containerRef = useRef<HTMLDivElement>(null)
  const { width, data, isIndividualSupported } = useResponsiveVisualization(containerRef, {
    start,
    end,
    timeseriesInterval,
    labelKey: dateKey,
    aggregatedValueKeys,
    individualValueKey,
    getAggregatedData,
    getIndividualData,
    getIsIndividualSupported: getIsIndividualTimeseriesSupported,
  })

  if (!getAggregatedData && !getIndividualData) {
    console.warn('No data getters functions provided')
    return null
  }

  return (
    <div ref={containerRef} className={styles.container}>
      {!data ? (
        <TimeseriesPlaceholder />
      ) : isIndividualSupported ? (
        <IndividualTimeseries
          width={width}
          data={data as ResponsiveVisualizationData<'individual'>}
          start={start}
          end={end}
          color={color}
          dateKey={dateKey}
          timeseriesInterval={timeseriesInterval}
          valueKeys={individualValueKey}
          onClick={onIndividualItemClick}
          tickLabelFormatter={tickLabelFormatter}
          customTooltip={individualTooltip}
          icon={individualIcon}
        />
      ) : (
        <AggregatedTimeseries
          data={data as ResponsiveVisualizationData<'aggregated'>}
          start={start}
          end={end}
          color={color}
          dateKey={dateKey}
          timeseriesInterval={timeseriesInterval}
          valueKeys={aggregatedValueKeys}
          onClick={onAggregatedItemClick}
          tickLabelFormatter={tickLabelFormatter}
          customTooltip={aggregatedTooltip}
        />
      )}
    </div>
  )
}
