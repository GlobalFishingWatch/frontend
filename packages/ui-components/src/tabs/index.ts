export { default } from './Tabs'

export interface Tab {
  id: string
  title: string | React.ReactElement
  content: React.ReactNode
}
