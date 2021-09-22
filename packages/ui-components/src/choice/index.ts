import type { Placement } from 'tippy.js'
import { TooltipTypes } from '..'

export { default } from './Choice'

export interface ChoiceOption {
  id: string
  title: string
  disabled?: boolean
  tooltip?: TooltipTypes
  tooltipPlacement?: Placement
}
