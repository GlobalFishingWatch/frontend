export * from './Tabs'

export interface Tab<ID = string> {
  id: ID
  title: string | React.ReactElement
  content?: React.ReactNode
  disabled?: boolean
}
