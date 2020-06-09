export { default } from './TagList'

export type TagItemId = string | number
export type TagItem = {
  id: TagItemId
  label: string
}
export type TagListOnRemove = (id: TagItemId, currentOptions: TagItem[]) => void
