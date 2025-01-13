import { useRef } from 'react'
import type { ResponsiveVisualizationData } from '../../types'
import { getIsIndividualTimeseriesSupported } from '../../lib/density'
import type { BaseResponsiveChartProps, BaseResponsiveTimeseriesProps } from '../types'
import { useResponsiveVisualization } from '../hooks'
import {
  DEFAULT_AGGREGATED_VALUE_KEY,
  DEFAULT_INDIVIDUAL_VALUE_KEY,
  DEFAULT_DATE_KEY,
} from '../config'
import { IndividualTimeseries } from './TimeseriesIndividual'
import { AggregatedTimeseries } from './TimeseriesAggregated'
import styles from './Timeseries.module.css'

type ResponsiveTimeseriesProps = BaseResponsiveChartProps &
  BaseResponsiveTimeseriesProps & {
    dateKey?:
      | keyof ResponsiveVisualizationData<'aggregated'>[0]
      | keyof ResponsiveVisualizationData<'individual'>[0]
  }

export function ResponsiveTimeseries({
  start,
  end,
  dateKey = DEFAULT_DATE_KEY,
  aggregatedValueKey = DEFAULT_AGGREGATED_VALUE_KEY,
  individualValueKey = DEFAULT_INDIVIDUAL_VALUE_KEY,
  getIndividualData,
  getAggregatedData,
  color,
  tickLabelFormatter,
  aggregatedTooltip,
  individualTooltip,
  onIndividualItemClick,
  onAggregatedItemClick,
}: ResponsiveTimeseriesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { width, data, isIndividualSupported } = useResponsiveVisualization({
    containerRef,
    labelKey: dateKey,
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
        'Spinner'
      ) : isIndividualSupported ? (
        <IndividualTimeseries
          width={width}
          data={data as ResponsiveVisualizationData<'individual'>}
          start={start}
          end={end}
          color={color}
          dateKey={dateKey}
          valueKey={individualValueKey}
          onClick={onIndividualItemClick}
          tickLabelFormatter={tickLabelFormatter}
          customTooltip={individualTooltip}
        />
      ) : (
        <AggregatedTimeseries
          data={data as ResponsiveVisualizationData<'aggregated'>}
          start={start}
          end={end}
          color={color}
          dateKey={dateKey}
          valueKey={aggregatedValueKey}
          onClick={onAggregatedItemClick}
          tickLabelFormatter={tickLabelFormatter}
          customTooltip={aggregatedTooltip}
        />
      )}
    </div>
  )
}
