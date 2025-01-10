import type { ResponsiveVisualizationData } from '../../types'
import { getIsIndividualBarChartSupported } from '../../lib/density'
import type { BaseResponsiveBarChartProps, BaseResponsiveChartProps } from '../types'
import {
  DEFAULT_AGGREGATED_VALUE_KEY,
  DEFAULT_INDIVIDUAL_VALUE_KEY,
  DEFAULT_LABEL_KEY,
} from '../config'
import { useResponsiveVisualization } from '../hooks'
import { IndividualBarChart } from './BarChartIndividual'
import { AggregatedBarChart } from './BarChartAggregated'

type ResponsiveBarChartProps = BaseResponsiveChartProps &
  BaseResponsiveBarChartProps & { labelKey?: string }

export function ResponsiveBarChart({
  containerRef,
  getIndividualData,
  getAggregatedData,
  color,
  aggregatedValueKey = DEFAULT_AGGREGATED_VALUE_KEY,
  individualValueKey = DEFAULT_INDIVIDUAL_VALUE_KEY,
  labelKey = DEFAULT_LABEL_KEY,
  barLabel,
  aggregatedTooltip,
  individualTooltip,
  barValueFormatter,
  onIndividualItemClick,
  onAggregatedItemClick,
}: ResponsiveBarChartProps) {
  const { data, isIndividualSupported } = useResponsiveVisualization({
    containerRef,
    labelKey,
    aggregatedValueKey,
    individualValueKey,
    getAggregatedData,
    getIndividualData,
    getIsIndividualSupported: getIsIndividualBarChartSupported,
  })

  if (!getAggregatedData && !getIndividualData) {
    console.warn('No data getters functions provided')
    return null
  }

  if (!data) {
    return 'Spinner'
  }
  if (isIndividualSupported && !data) {
    return 'Spinner for individual'
  }

  return isIndividualSupported ? (
    <IndividualBarChart
      data={data as ResponsiveVisualizationData<'individual'>}
      color={color}
      valueKey={individualValueKey}
      labelKey={labelKey}
      onClick={onIndividualItemClick}
      barLabel={barLabel}
      customTooltip={individualTooltip}
      barValueFormatter={barValueFormatter}
    />
  ) : (
    <AggregatedBarChart
      data={data as ResponsiveVisualizationData<'aggregated'>}
      color={color}
      valueKey={aggregatedValueKey}
      labelKey={labelKey}
      onClick={onAggregatedItemClick}
      barLabel={barLabel}
      customTooltip={aggregatedTooltip}
      barValueFormatter={barValueFormatter}
    />
  )
}
