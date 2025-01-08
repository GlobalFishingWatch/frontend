export type ResponsiveVisualizationMode = 'individual' | 'aggregated'

export type ResponsiveVisualizationChart = 'barchart' | 'timeseries'

export type ResponsiveVisualizationAggregatedItem = { name: string; value: number }
export type ResponsiveVisualizationIndividualItem = {
  name: string
  values: { [key: string]: any }[]
}

export type ResponsiveVisualizationData<
  Data extends ResponsiveVisualizationMode | undefined = undefined,
> = Data extends 'aggregated'
  ? ResponsiveVisualizationAggregatedItem[]
  : Data extends 'individual'
    ? ResponsiveVisualizationIndividualItem[]
    : (ResponsiveVisualizationAggregatedItem | ResponsiveVisualizationIndividualItem)[]
