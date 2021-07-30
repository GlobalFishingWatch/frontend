import { CSSProperties } from 'react'
import { Placement } from 'tippy.js'
import { IconType } from '../icon'
import { TooltipTypes } from '../types/types'

export { default } from './IconButton'

export type IconButtonType = 'default' | 'invert' | 'border' | 'map-tool' | 'warning' | 'solid'
export type IconButtonSize = 'default' | 'medium' | 'small' | 'tiny'

export interface IconButtonProps {
  id?: string
  icon?: IconType
  type?: IconButtonType
  size?: IconButtonSize
  className?: string
  disabled?: boolean
  loading?: boolean
  onClick?: (e: React.MouseEvent) => void
  onMouseEnter?: (e: React.MouseEvent) => void
  onMouseLeave?: (e: React.MouseEvent) => void
  tooltip?: TooltipTypes
  tooltipPlacement?: Placement
  children?: React.ReactNode
  style?: CSSProperties
}
