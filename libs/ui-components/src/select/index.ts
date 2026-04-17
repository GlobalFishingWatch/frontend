import type { JSX } from 'react'

import type { TooltipPlacement } from '../tooltip'

export * from './Select'

export type SelectOption<Id = any, Label = string | JSX.Element> = {
  id: Id
  label: Label
  labelString?: string
  disabled?: boolean
  tooltip?: string
  tooltipPlacement?: TooltipPlacement
}
/**
 * Callback on selecting or removing options
 * @param {SelectOption} option - Selected option
 */
export type SelectOnChange = (option: SelectOption) => void
/**
 * Callback on removing all options
 */
export type SelectOnRemove = (event: React.MouseEvent) => void
