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
 * @param {SelectOption[]} [selectedOptions] - The list of new options after changes
 */
export type SelectOnChange = (option: SelectOption, selectedOptions: SelectOption[]) => void
/**
 * Callback on removing all options
 */
export type SelectOnRemove = (event: React.MouseEvent) => void
