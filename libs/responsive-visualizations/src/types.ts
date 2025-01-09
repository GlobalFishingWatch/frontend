export type ResponsiveVisualizationMode = 'individual' | 'aggregated'

export type ResponsiveVisualizationChart = 'barchart' | 'timeseries'

export type ResponsiveVisualizationItem = Record<string, any>
export type ResponsiveVisualizationAggregatedItem<Item = ResponsiveVisualizationItem> = {
  label?: string
  value?: number
} & Item

export type ResponsiveVisualizationIndividualItem<Item = ResponsiveVisualizationItem> = {
  label?: string
  values?: ResponsiveVisualizationItem[]
} & Item

export type ResponsiveVisualizationData<
  Mode extends ResponsiveVisualizationMode | undefined = undefined,
  Data = ResponsiveVisualizationItem,
> = Mode extends 'aggregated'
  ? ResponsiveVisualizationAggregatedItem<Data>[]
  : Mode extends 'individual'
    ? ResponsiveVisualizationIndividualItem<Data>[]
    : (ResponsiveVisualizationAggregatedItem | ResponsiveVisualizationIndividualItem)[]
