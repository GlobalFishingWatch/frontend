import type { ReactElement } from 'react'
import type {
  ResponsiveVisualizationData,
  ResponsiveVisualizationItem,
  ResponsiveVisualizationMode,
} from '../types'

// Shared types between all charts
export type ResponsiveVisualizationInteractionCallback<Item = ResponsiveVisualizationItem> = (
  item: Item
) => void

export type ResponsiveVisualizationContainerRef = React.RefObject<HTMLElement | null>
export type BaseResponsiveChartProps = {
  containerRef: ResponsiveVisualizationContainerRef
  // Aggregated props
  aggregatedTooltip?: ReactElement
  onAggregatedItemClick?: ResponsiveVisualizationInteractionCallback
  getAggregatedData?: () => Promise<ResponsiveVisualizationData<'aggregated'> | undefined>
  aggregatedValueKey?: string
  // Individual props
  individualTooltip?: ReactElement
  onIndividualItemClick?: ResponsiveVisualizationInteractionCallback
  getIndividualData?: () => Promise<ResponsiveVisualizationData<'individual'> | undefined>
  individualValueKey?: string
}

// Shared types within the BarChart
export type BaseResponsiveBarChartProps = {
  color: string
  barLabel?: ReactElement<SVGElement>
  barValueFormatter?: (value: any) => string
}

export type BarChartByTypeProps<M extends ResponsiveVisualizationMode> =
  BaseResponsiveBarChartProps & {
    labelKey: string
    valueKey: string
    data: ResponsiveVisualizationData<M>
    onClick?: ResponsiveVisualizationInteractionCallback
    customTooltip?: ReactElement
  }

// Shared types within the Timeseries
export type BaseResponsiveTimeseriesProps = {
  start: string
  end: string
  color: string
  tickLabel?: ReactElement<SVGElement>
}

export type TimeseriesByTypeProps<M extends ResponsiveVisualizationMode> =
  BaseResponsiveTimeseriesProps & {
    dateKey: string
    valueKey: string
    data: ResponsiveVisualizationData<M>
    onClick?: ResponsiveVisualizationInteractionCallback
    customTooltip?: ReactElement
  }
