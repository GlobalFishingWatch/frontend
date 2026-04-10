import { type ReactNode, useMemo } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { Spinner } from '@globalfishingwatch/ui-components'

import { SCROLL_CONTAINER_DOM_ID } from 'features/sidebar/sidebar.utils'
import { selectIsUserLogged } from 'features/user/selectors/user.selectors'

import styles from './ContentPanel.module.css'

type ContentPanelProps = {
  children: ReactNode
  sidePanelId?: string
}

function ContentPanel({ sidePanelId, children }: ContentPanelProps) {
  console.log('🚀 ~ ContentPanel ~ sidePanelId:', sidePanelId)
  const isUserLogged = useSelector(selectIsUserLogged)

  const content = useMemo(() => {
    if (!sidePanelId) return null
    if (!isUserLogged) {
      return <Spinner />
    }
    return children
  }, [isUserLogged, children, sidePanelId])

  return (
    <div className={cx(styles.container)}>
      <div className={cx(styles.content)}>
        <div className={cx('scrollContainer', styles.scrollContainer)}>
          <h1>test</h1>
          {content}
        </div>
      </div>
    </div>
  )
}

export default ContentPanel
