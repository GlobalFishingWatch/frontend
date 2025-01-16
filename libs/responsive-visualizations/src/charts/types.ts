import type { ReactElement } from 'react'

import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'

import type {
  ResponsiveVisualizationData,
  ResponsiveVisualizationMode,
  ResponsiveVisualizationValue,
} from '../types'

// Shared types between all charts
export type ResponsiveVisualizationInteractionCallback<Item = ResponsiveVisualizationValue> = (
  item: Item
) => void

export type ResponsiveVisualizationAggregatedValueKey =
  keyof ResponsiveVisualizationData<'aggregated'>[0]

export type ResponsiveVisualizationIndividualValueKey =
  keyof ResponsiveVisualizationData<'individual'>[0]

export type BaseResponsiveChartProps = {
  // Aggregated props
  aggregatedTooltip?: ReactElement
  onAggregatedItemClick?: ResponsiveVisualizationInteractionCallback
  getAggregatedData?: () => Promise<ResponsiveVisualizationData<'aggregated'> | undefined>
  aggregatedValueKey?:
    | ResponsiveVisualizationAggregatedValueKey
    | ResponsiveVisualizationAggregatedValueKey[]
  // Individual props
  individualTooltip?: ReactElement
  individualItem?: ReactElement
  onIndividualItemClick?: ResponsiveVisualizationInteractionCallback
  getIndividualData?: () => Promise<ResponsiveVisualizationData<'individual'> | undefined>
  individualValueKey?: ResponsiveVisualizationIndividualValueKey
  individualIcon?: ReactElement
}

// Shared types within the BarChart
export type BaseResponsiveBarChartProps = {
  color?: string
  barLabel?: ReactElement<SVGElement>
  barValueFormatter?: (value: number) => string
}

export type BarChartByTypeProps<M extends ResponsiveVisualizationMode> =
  BaseResponsiveBarChartProps & {
    labelKey: keyof ResponsiveVisualizationData<M>[0]
    valueKeys: (keyof ResponsiveVisualizationData<M>[0])[] | keyof ResponsiveVisualizationData<M>[0]
    data: ResponsiveVisualizationData<M>
    onClick?: ResponsiveVisualizationInteractionCallback
    customTooltip?: ReactElement
    customItem?: ReactElement
  }

// Shared types within the Timeseries
export type BaseResponsiveTimeseriesProps = {
  start: string
  end: string
  color: string
  timeseriesInterval: FourwingsInterval
  tickLabelFormatter?: (item: string, interval: FourwingsInterval) => string
}

export type TimeseriesByTypeProps<M extends ResponsiveVisualizationMode> =
  BaseResponsiveTimeseriesProps & {
    dateKey: keyof ResponsiveVisualizationData<M>[0]
    valueKeys: (keyof ResponsiveVisualizationData<M>[0])[] | keyof ResponsiveVisualizationData<M>[0]
    data: ResponsiveVisualizationData<M>
    onClick?: ResponsiveVisualizationInteractionCallback
    customTooltip?: ReactElement
  }
