import type { Placement } from '@popperjs/core'

export * from './Tabs'

export interface Tab<ID = string> {
  id: ID
  title: string | React.ReactElement | null
  content?: React.ReactNode | null
  tooltip?: string | null
  tooltipPlacement?: Placement
  disabled?: boolean
  testId?: string
}
