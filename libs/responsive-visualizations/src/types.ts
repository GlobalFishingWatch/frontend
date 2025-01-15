export type ResponsiveVisualizationMode = 'individual' | 'aggregated'

export type ResponsiveVisualizationChart = 'barchart' | 'timeseries'

export type ResponsiveVisualizationKey = string

export type ResponsiveVisualizationLabel = string
export type ResponsiveVisualizationIndividualValue = Record<string, any>
export type ResponsiveVisualizationAggregatedValue =
  | number
  | {
      label?: string
      color?: string
      value: number
    }

export type ResponsiveVisualizationValue<
  Mode extends ResponsiveVisualizationMode | undefined = undefined,
> = Mode extends 'aggregated'
  ? ResponsiveVisualizationAggregatedValue
  : Mode extends 'individual'
    ? ResponsiveVisualizationIndividualValue
    : ResponsiveVisualizationAggregatedValue | ResponsiveVisualizationIndividualValue

export type ResponsiveVisualizationAggregatedItem = Record<
  ResponsiveVisualizationKey,
  ResponsiveVisualizationLabel | ResponsiveVisualizationValue<'aggregated'>
>
export type ResponsiveVisualizationIndividualItem = Record<
  ResponsiveVisualizationKey,
  ResponsiveVisualizationLabel | ResponsiveVisualizationValue<'individual'>[]
>

export type ResponsiveVisualizationItem =
  | ResponsiveVisualizationAggregatedItem
  | ResponsiveVisualizationIndividualItem

export type ResponsiveVisualizationData<
  Mode extends ResponsiveVisualizationMode | undefined = undefined,
> = Mode extends 'aggregated'
  ? ResponsiveVisualizationAggregatedItem[]
  : Mode extends 'individual'
    ? ResponsiveVisualizationIndividualItem[]
    : (ResponsiveVisualizationAggregatedItem | ResponsiveVisualizationIndividualItem)[]
