import cx from 'classnames'

import { Icon } from '@globalfishingwatch/ui-components/icon'

import { useTimebar } from '../timebar-context'
import { getTime } from '../utils'

import styles from '../timebar.module.css'

export function TimebarBookmarkButton() {
  const { labels, start, end, bookmarkStart, bookmarkEnd, onBookmarkChange } = useTimebar()

  const hasBookmark =
    bookmarkStart !== undefined &&
    bookmarkStart !== null &&
    bookmarkEnd !== undefined &&
    bookmarkEnd !== null
  const bookmarkDisabled =
    hasBookmark && getTime(bookmarkStart) === getTime(start) && getTime(bookmarkEnd) === getTime(end)

  const setBookmark = () => {
    onBookmarkChange?.(start, end)
  }

  return (
    <button
      type="button"
      title={labels.setBookmark}
      className={cx('print-hidden', styles.uiButton, styles.bookmark)}
      onClick={setBookmark}
      disabled={bookmarkDisabled === true}
      data-testid="timebar-bookmark-button"
    >
      {hasBookmark ? <Icon icon="bookmark-filled" /> : <Icon icon="bookmark" />}
    </button>
  )
}
