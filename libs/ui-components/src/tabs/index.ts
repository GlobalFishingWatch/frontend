export * from './Tabs'

export interface Tab<ID = string> {
  id: ID
  title: string | React.ReactElement | null
  content?: React.ReactNode | null
  tooltip?: string | null
  disabled?: boolean
}
