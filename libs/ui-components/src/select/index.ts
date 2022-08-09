export * from './Select'

export type SelectOption<T = any> = {
  id: T
  label: string | JSX.Element
  tooltip?: string
  disabled?: boolean
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
