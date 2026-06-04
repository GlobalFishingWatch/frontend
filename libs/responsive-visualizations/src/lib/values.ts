import type { ResponsiveVisualizationLabel, ResponsiveVisualizationValue } from '../types'

export const DEFAULT_LABEL_KEY = 'label'

export const getResponsiveVisualizationItemValue = (
  value: ResponsiveVisualizationValue | ResponsiveVisualizationLabel
): number => {
  if (typeof value === 'string') {
    return parseFloat(value)
  }
  if (typeof value === 'number') {
    return value
  }
  return value?.value
}
