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
 * Callback on removing all options
 */
export type MultiSelectOnRemove = (event: React.MouseEvent) => void
