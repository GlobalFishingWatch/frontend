import { useMemo } from 'react'

export enum LegendType {
  ColorRamp = 'colorramp',
  ColorRampDiscrete = 'colorramp-discrete',
  Solid = 'solid',
  Bivariate = 'bivariate',
}
export interface GeneratorLegend {
  type?: string
  label?: string
  unit?: string
  color?: string
}

export interface LayerMetadataLegend extends GeneratorLegend {
  id: string
  type: LegendType
  gridArea?: number | string
  ramp?: [number | null | string, string][]
  colorRamp?: string[]
  loading?: boolean
  currentValue?: number
  divergent?: boolean
  [key: string]: any
}

type UILayer = {
  color: string
  generatorId: string
  generatorType: string
}
export interface LayerMetadataLegendBivariate extends LayerMetadataLegend {
  type: LegendType.Bivariate
  currentValues: [number, number]
  sublayersBreaks: [number[], number[]]
  bivariateRamp: string[]
}
export type LegendLayer = LayerMetadataLegend & UILayer
export type LegendLayerBivariate = LayerMetadataLegendBivariate & UILayer

export const useHeatmapLegends = (dataviews, hoveredEvent) => {
  useMemo(() => {}, [dataviews, hoveredEvent])
}
