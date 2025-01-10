import type {
  DEFAULT_LABEL_KEY,
  DEFAULT_DATE_KEY,
  DEFAULT_AGGREGATED_VALUE_KEY,
  DEFAULT_INDIVIDUAL_VALUE_KEY,
} from './charts/config'

export type ResponsiveVisualizationMode = 'individual' | 'aggregated'

export type ResponsiveVisualizationChart = 'barchart' | 'timeseries'

export type DefaultResponsiveVisualizationLabels = {
  [DEFAULT_LABEL_KEY]: string
  [DEFAULT_DATE_KEY]: string
}
export type ResponsiveVisualizationItem = Record<string, any>
export type ResponsiveVisualizationAggregatedItem<
  Item = DefaultResponsiveVisualizationLabels & {
    [DEFAULT_AGGREGATED_VALUE_KEY]: number
  },
> = Item

export type ResponsiveVisualizationIndividualItem<
  Item = DefaultResponsiveVisualizationLabels & {
    [DEFAULT_INDIVIDUAL_VALUE_KEY]: ResponsiveVisualizationItem[]
  },
> = Item

export type ResponsiveVisualizationData<
  Mode extends ResponsiveVisualizationMode | undefined = undefined,
  Data extends
    | ResponsiveVisualizationAggregatedItem
    | ResponsiveVisualizationIndividualItem = Mode extends 'aggregated'
    ? ResponsiveVisualizationAggregatedItem
    : ResponsiveVisualizationIndividualItem,
> = Mode extends 'aggregated'
  ? ResponsiveVisualizationAggregatedItem<Data>[]
  : Mode extends 'individual'
    ? ResponsiveVisualizationIndividualItem<Data>[]
    : (ResponsiveVisualizationAggregatedItem | ResponsiveVisualizationIndividualItem)[]
