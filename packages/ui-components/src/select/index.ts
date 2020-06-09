export { default } from './Select'

export type SelectOptionId = number | string
export type SelectOption = {
  id: SelectOptionId
  label: string
  tooltip?: string
}
