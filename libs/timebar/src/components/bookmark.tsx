import classNames from 'classnames'
import type { ScaleTime } from 'd3-scale'

import { getUTCDate } from '@globalfishingwatch/data-transforms'
import { Icon } from '@globalfishingwatch/ui-components'

import { getHumanizedDates } from '../utils'

import styles from './bookmark.module.css'

const MIN_WIDTH = 32
const MIN_WIDTH_WITH_OVERFLOW_ARROWS = 52
const COMPACT_MAX_WIDTH = 240

type BookmarkProps = {
  labels?: {
    goToBookmark?: string
    deleteBookmark?: string
  }
  placement?: string
  bookmarkStart: string
  bookmarkEnd: string
  scale: ScaleTime<number, number, never>
  minX: number
  maxX: number
  onSelect: (...args: unknown[]) => unknown
  onDelete: (...args: unknown[]) => unknown
  locale?: string
}

const Bookmark = ({
  labels = {
    goToBookmark: 'Go to your bookmarked time range',
    deleteBookmark: 'Delete time range bookmark',
  },
  placement = 'top',
  scale,
  bookmarkStart,
  bookmarkEnd,
  minX,
  maxX,
  onSelect,
  onDelete,
  locale = 'en',
}: BookmarkProps) => {
  const x = scale(getUTCDate(bookmarkStart))
  const width = scale(getUTCDate(bookmarkEnd)) - x
  const { humanizedStart, humanizedEnd } = getHumanizedDates(bookmarkStart, bookmarkEnd, locale)
  const label = [humanizedStart, humanizedEnd].join(' - ')

  let overflowing
  let overflowingLeft
  let overflowingRight
  let renderedX = x
  let renderedWidth = width

  if (x < minX) {
    renderedX = minX
    renderedWidth = x + renderedWidth
    overflowing = true
    overflowingLeft = true
  }
  if (renderedX + width > maxX) {
    renderedX = Math.min(renderedX, maxX - MIN_WIDTH_WITH_OVERFLOW_ARROWS)
    renderedWidth = maxX - renderedX
    overflowing = true
    overflowingRight = true
  }

  const minWidth = overflowing === true ? MIN_WIDTH_WITH_OVERFLOW_ARROWS : MIN_WIDTH
  renderedWidth = Math.max(minWidth, renderedWidth)
  const compact = renderedWidth < COMPACT_MAX_WIDTH
  const point = renderedWidth <= MIN_WIDTH

  return (
    <div
      className={classNames(styles.Bookmark, {
        [styles.bottomPlacement]: placement === 'bottom',
        [styles._overflowingLeft]: overflowingLeft,
        [styles._overflowingRight]: overflowingRight,
        [styles._compact]: compact,
        [styles._point]: point,
      })}
      style={{ left: renderedX, width: renderedWidth }}
    >
      <button type="button" title={labels.goToBookmark} className={styles.main} onClick={onSelect}>
        {overflowingLeft && <Icon icon="arrow-left" />}
        <Icon icon="bookmark-filled" />
        {compact === false && <span className={styles.title}>{label}</span>}
        {overflowingRight && <Icon icon="arrow-right" />}
      </button>
      {compact === false && (
        <button
          type="button"
          title={labels.deleteBookmark}
          className={styles.delete}
          onClick={onDelete}
        >
          <Icon icon="delete" />
        </button>
      )}
    </div>
  )
}

export default Bookmark
