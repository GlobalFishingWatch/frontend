import { useRef } from 'react'
import type { ResponsiveVisualizationData } from '../../types'
import { getIsIndividualTimeseriesSupported } from '../../lib/density'
import type {
  BaseResponsiveChartProps,
  BaseResponsiveTimeseriesProps,
  ResponsiveVisualizationAnyItemKey,
} from '../types'
import { useResponsiveVisualization } from '../hooks'
import {
  DEFAULT_AGGREGATED_VALUE_KEY,
  DEFAULT_INDIVIDUAL_VALUE_KEY,
  DEFAULT_DATE_KEY,
} from '../config'
import TimeseriesPlaceholder from '../placeholders/TimeseriesPlaceholder'
import { IndividualTimeseries } from './TimeseriesIndividual'
import { AggregatedTimeseries } from './TimeseriesAggregated'
import styles from './Timeseries.module.css'

type ResponsiveTimeseriesProps = BaseResponsiveChartProps &
  BaseResponsiveTimeseriesProps & {
    dateKey?: ResponsiveVisualizationAnyItemKey | string
  }

export function ResponsiveTimeseries({
  start,
  end,
  dateKey = DEFAULT_DATE_KEY,
  aggregatedValueKey = DEFAULT_AGGREGATED_VALUE_KEY,
  individualValueKey = DEFAULT_INDIVIDUAL_VALUE_KEY,
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
  const containerRef = useRef<HTMLDivElement>(null)
  const { width, data, isIndividualSupported } = useResponsiveVisualization(containerRef, {
    start,
    end,
    timeseriesInterval,
    labelKey: dateKey as ResponsiveVisualizationAnyItemKey,
    individualValueKey,
    aggregatedValueKey,
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
          dateKey={dateKey as ResponsiveVisualizationAnyItemKey}
          timeseriesInterval={timeseriesInterval}
          valueKey={individualValueKey}
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
          dateKey={dateKey as ResponsiveVisualizationAnyItemKey}
          timeseriesInterval={timeseriesInterval}
          valueKey={aggregatedValueKey}
          onClick={onAggregatedItemClick}
          tickLabelFormatter={tickLabelFormatter}
          customTooltip={aggregatedTooltip}
        />
      )}
    </div>
  )
}
