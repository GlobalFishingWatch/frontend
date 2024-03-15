export enum LegendType {
  ColorRamp = 'colorramp',
  ColorRampDiscrete = 'colorramp-discrete',
  Solid = 'solid',
  Bivariate = 'bivariate',
}

type BaseLegend = {
  id: string
  type: LegendType
  label?: string
  unit?: string
  gridArea?: number | string
  loading?: boolean
  divergent?: boolean
}

export type UILegendSolid = BaseLegend & {
  type: LegendType.Solid
  color: string
  currentValue?: number
}

export type UILegendColorRamp = BaseLegend & {
  type: LegendType
  values?: number[]
  colors?: string[]
  currentValue?: number | number[]
}

export type UILegendBivariate = BaseLegend & {
  type: LegendType.Bivariate
  values?: [number[], number[]]
  colors?: string[]
  currentValue?: [number, number]
}

export type UILegend = UILegendSolid | UILegendColorRamp | UILegendBivariate
