import type { ReactElement } from 'react'
import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
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
  // Aggregated props
  aggregatedTooltip?: ReactElement
  onAggregatedItemClick?: ResponsiveVisualizationInteractionCallback
  getAggregatedData?: () => Promise<ResponsiveVisualizationData<'aggregated'> | undefined>
  aggregatedValueKey?: keyof ResponsiveVisualizationData<'aggregated'>[0]
  // Individual props
  individualTooltip?: ReactElement
  onIndividualItemClick?: ResponsiveVisualizationInteractionCallback
  getIndividualData?: () => Promise<ResponsiveVisualizationData<'individual'> | undefined>
  individualValueKey?: keyof ResponsiveVisualizationData<'individual'>[0]
}

// TODO: remove this
export type ResponsiveVisualizationAnyItemKey =
  | keyof ResponsiveVisualizationData<'aggregated'>[0]
  | keyof ResponsiveVisualizationData<'individual'>[0]

// Shared types within the BarChart
export type BaseResponsiveBarChartProps = {
  color: string
  barLabel?: ReactElement<SVGElement>
  barValueFormatter?: (value: number) => string
}

export type BarChartByTypeProps<M extends ResponsiveVisualizationMode> =
  BaseResponsiveBarChartProps & {
    labelKey: ResponsiveVisualizationAnyItemKey
    valueKey: keyof ResponsiveVisualizationData<M>[0]
    data: ResponsiveVisualizationData<M>
    onClick?: ResponsiveVisualizationInteractionCallback
    customTooltip?: ReactElement
  }

// Shared types within the Timeseries
export type BaseResponsiveTimeseriesProps = {
  start: string
  end: string
  color: string
  tickLabelFormatter?: (item: string, interval: FourwingsInterval) => string
}

export type TimeseriesByTypeProps<M extends ResponsiveVisualizationMode> =
  BaseResponsiveTimeseriesProps & {
    dateKey: ResponsiveVisualizationAnyItemKey
    valueKey: keyof ResponsiveVisualizationData<M>[0]
    data: ResponsiveVisualizationData<M>
    onClick?: ResponsiveVisualizationInteractionCallback
    customTooltip?: ReactElement
  }
