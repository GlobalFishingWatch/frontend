import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { getHumanizedDates } from '../utils'
import ImmediateContext from '../immediateContext'
import { ReactComponent as IconBookmarkFilled } from '../icons/bookmarkFilled.svg'
import { ReactComponent as IconDelete } from '../icons/delete.svg'
import { ReactComponent as Arrow } from '../icons/arrow.svg'
import styles from './bookmark.module.css'

const MIN_WIDTH = 32
const MIN_WIDTH_WITH_OVERFLOW_ARROWS = 52
const COMPACT_MAX_WIDTH = 240

const Bookmark = ({ scale, bookmarkStart, bookmarkEnd, minX, maxX, onSelect, onDelete }) => {
  const { immediate } = useContext(ImmediateContext)

  const x = scale(new Date(bookmarkStart))
  const width = scale(new Date(bookmarkEnd)) - x
  const { humanizedStart, humanizedEnd } = getHumanizedDates(bookmarkStart, bookmarkEnd)
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
        [styles._overflowingLeft]: overflowingLeft,
        [styles._overflowingRight]: overflowingRight,
        [styles._compact]: compact,
        [styles._point]: point,
        [styles._immediate]: immediate,
      })}
      style={{ left: renderedX, width: renderedWidth }}
    >
      <button
        type="button"
        title="Go to your bookmarked time range"
        className={styles.main}
        onClick={onSelect}
      >
        {overflowingLeft && <Arrow className={styles.leftArrow} />}
        <IconBookmarkFilled className={styles.icon} />
        {compact === false && <span className={styles.title}>{label}</span>}
        {overflowingRight && <Arrow className={styles.rightArrow} />}
      </button>
      {compact === false && (
        <button
          type="button"
          title="Delete time range bookmark"
          className={styles.delete}
          onClick={onDelete}
        >
          <IconDelete />
        </button>
      )}
    </div>
  )
}

Bookmark.propTypes = {
  bookmarkStart: PropTypes.string.isRequired,
  bookmarkEnd: PropTypes.string.isRequired,
  scale: PropTypes.func.isRequired,
  minX: PropTypes.number.isRequired,
  maxX: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default Bookmark
