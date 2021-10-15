export { default } from './Tabs'

export interface Tab {
  id: string
  title: string | React.ReactNode
  content: React.ReactNode
}
