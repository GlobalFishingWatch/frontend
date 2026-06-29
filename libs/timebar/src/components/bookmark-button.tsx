import cx from 'classnames'

import { Icon } from '@globalfishingwatch/ui-components/icon'

import { useTimebar } from '../timebar-context'

import styles from '../timebar.module.css'

export function TimebarBookmarkButton() {
  const { labels, setBookmark, hasBookmark, bookmarkDisabled } = useTimebar()

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
