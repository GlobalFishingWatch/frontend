import type { Placement } from 'tippy.js'
import type { JSX } from 'react'
export * from './Select'

export type SelectOption<Id = any, Label = string | JSX.Element> = {
  id: Id
  label: Label
  disabled?: boolean
  tooltip?: string
  tooltipPlacement?: Placement
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
