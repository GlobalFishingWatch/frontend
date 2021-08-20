export { default } from './MultiSelect'

export type SelectOptionId = number | string
export type MultiSelectOption<T = any> = {
  id: T
  label: string
  alias?: string[]
  tooltip?: string
}
/**
 * Callback on selecting or removing options
 * @param {SelectOption} option - Selected option
 * @param {SelectOption[]} [selectedOptions] - The list of new options after changes
 */
export type MultiSelectOnChange = (
  option: MultiSelectOption,
  selectedOptions: MultiSelectOption[]
) => void
/**
 * Callback on filtering options
 * @param {MultiSelectOption} options - The list of options available
 * @param {string} [filter] - The text entered by the user to filter on
 */
export type MultiSelectOnFilter = (
  allOptions: MultiSelectOption[],
  filteredOptions: MultiSelectOption[],
  filter?: string
) => MultiSelectOption[]
/**
 * Callback on removing all options
 */
export type MultiSelectOnRemove = (event: React.MouseEvent) => void
