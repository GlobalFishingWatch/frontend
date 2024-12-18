import type { TooltipPlacement } from '../tooltip'

export * from './Tabs'

export interface Tab<ID = string> {
  id: ID
  title: string | React.ReactElement<any> | null
  content?: React.ReactNode | null
  tooltip?: string | null
  tooltipPlacement?: TooltipPlacement
  disabled?: boolean
  testId?: string
}
