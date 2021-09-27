import { Placement } from 'tippy.js'
import { TooltipTypes } from '../types/types'
import { MouseEvent } from 'react'
export { default } from './Switch'

// TODO Maybe a simple way is to have the Switch component wrap an <input type="checkbox"> so that we can use the React native event
export interface SwitchEvent extends MouseEvent {
  active: boolean
}

export interface SwitchProps {
  id?: string
  active: boolean
  disabled?: boolean
  onClick: (event: SwitchEvent) => void
  color?: string
  tooltip?: TooltipTypes
  tooltipPlacement?: Placement
  className?: string
}
