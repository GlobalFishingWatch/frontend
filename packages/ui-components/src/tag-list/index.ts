export { default } from './TagList'

export type TagItem = {
  id: string | number
  label: string
}
/**
 * Callback on tag removal
 * @param {TagItem} tag - Tag removed
 * @param {TagItem[]} [tags] - The list of new tags filtered
 */
export type TagListOnRemove = (tag: TagItem, tags: TagItem[]) => void
