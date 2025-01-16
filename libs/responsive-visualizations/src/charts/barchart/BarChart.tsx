import { useRef } from 'react'
import type { ResponsiveVisualizationData } from '../../types'
import { getIsIndividualBarChartSupported } from '../../lib/density'
import type { BaseResponsiveBarChartProps, BaseResponsiveChartProps } from '../types'
import {
  DEFAULT_AGGREGATED_VALUE_KEY,
  DEFAULT_INDIVIDUAL_VALUE_KEY,
  DEFAULT_LABEL_KEY,
} from '../config'
import { useResponsiveVisualization, useValueKeys } from '../hooks'
import { BarChartPlaceholder } from '../placeholders/BarChartPlaceholder'
import { IndividualBarChart } from './BarChartIndividual'
import { AggregatedBarChart } from './BarChartAggregated'
import styles from './BarChart.module.css'

type ResponsiveBarChartProps = BaseResponsiveChartProps &
  BaseResponsiveBarChartProps & { labelKey?: keyof ResponsiveVisualizationData[0] }

export function ResponsiveBarChart({
  getIndividualData,
  getAggregatedData,
  color,
  aggregatedValueKey = DEFAULT_AGGREGATED_VALUE_KEY,
  individualValueKey = DEFAULT_INDIVIDUAL_VALUE_KEY,
  labelKey = DEFAULT_LABEL_KEY,
  barLabel,
  aggregatedTooltip,
  individualTooltip,
  individualItem,
  barValueFormatter,
  onIndividualItemClick,
  onAggregatedItemClick,
}: ResponsiveBarChartProps) {
  const { individualValueKeys, aggregatedValueKeys } = useValueKeys(
    individualValueKey,
    aggregatedValueKey
  )
  const containerRef = useRef<HTMLDivElement>(null)
  const { data, isIndividualSupported, individualItemSize } = useResponsiveVisualization(
    containerRef,
    {
      labelKey,
      aggregatedValueKeys,
      individualValueKeys,
      getAggregatedData,
      getIndividualData,
      getIsIndividualSupported: getIsIndividualBarChartSupported,
    }
  )

  if (!getAggregatedData && !getIndividualData) {
    console.warn('No data getters functions provided')
    return null
  }

  return (
    <div ref={containerRef} className={styles.container}>
      {!data ? (
        <BarChartPlaceholder />
      ) : isIndividualSupported ? (
        <IndividualBarChart
          data={data as ResponsiveVisualizationData<'individual'>}
          color={color}
          pointSize={individualItemSize}
          valueKeys={individualValueKeys}
          labelKey={labelKey}
          onClick={onIndividualItemClick}
          barLabel={barLabel}
          customTooltip={individualTooltip}
          customItem={individualItem}
          barValueFormatter={barValueFormatter}
        />
      ) : (
        <AggregatedBarChart
          data={data as ResponsiveVisualizationData<'aggregated'>}
          color={color}
          valueKeys={aggregatedValueKeys}
          labelKey={labelKey}
          onClick={onAggregatedItemClick}
          barLabel={barLabel}
          customTooltip={aggregatedTooltip}
          barValueFormatter={barValueFormatter}
        />
      )}
    </div>
  )
}
