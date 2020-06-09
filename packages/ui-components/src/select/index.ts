export { default } from './Select'

export type SelectOptionId = number | string
export type SelectOption = {
  id: SelectOptionId
  label: string
  tooltip?: string
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
