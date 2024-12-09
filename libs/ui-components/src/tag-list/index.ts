import type { Placement } from 'tippy.js'
import type { TooltipTypes } from '../types/types'

export * from './TagList'

export type TagItem = {
  id: string | number
  label: string
  tooltip?: TooltipTypes
  tooltipPlacement?: Placement
}
/**
 * Callback on tag removal
 * @param {TagItem} tag - Tag removed
 * @param {TagItem[]} [tags] - The list of new tags filtered
 */
export type TagListOnRemove = (tag: TagItem, tags: TagItem[]) => void
