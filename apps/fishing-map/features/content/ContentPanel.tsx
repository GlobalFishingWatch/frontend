import { type ReactNode, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { DatasetTypes } from '@globalfishingwatch/api-types'
import { SMALL_PHONE_BREAKPOINT, useSmallScreen } from '@globalfishingwatch/react-hooks'
import { Spinner } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { selectReadOnly } from 'features/app/selectors/app.selectors'
import { selectDataviewsResources } from 'features/dataviews/selectors/dataviews.resolvers.selectors'
import { selectScreenshotModalOpen } from 'features/modals/modals.slice'
import { fetchResourceThunk } from 'features/resources/resources.slice'
import { SCROLL_CONTAINER_DOM_ID } from 'features/sidebar/sidebar.utils'
import { selectTrackCorrectionOpen } from 'features/track-correction/track-selection.selectors'
import TrackCorrection from 'features/track-correction/TrackCorrection'
import { selectIsUserLogged, selectUserStatus } from 'features/user/selectors/user.selectors'
import { fetchVesselGroupsThunk } from 'features/vessel-groups/vessel-groups.slice'
import ErrorPlaceholder from 'features/workspace/ErrorPlaceholder'
import { AsyncReducerStatus } from 'utils/async-slice'
import { htmlSafeParse } from 'utils/html-parser'

import styles from './ContentPanel.module.css'

type ContentPanelProps = {
  children: ReactNode
  sidePanelId?: string
}

function ContentPanel({ sidePanelId, children }: ContentPanelProps) {
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
        <div
          id={SCROLL_CONTAINER_DOM_ID}
          className={cx('scrollContainer', styles.scrollContainer)}
          data-testid="sidebar-container"
        >
          {content}
        </div>
      </div>
    </div>
  )
}

export default ContentPanel
