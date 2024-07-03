import { Fragment, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Link from 'redux-first-router-link'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { Icon, IconButton, IconType, Tooltip } from '@globalfishingwatch/ui-components'
import {
  DEFAULT_WORKSPACE_CATEGORY,
  DEFAULT_WORKSPACE_ID,
  WorkspaceCategory,
} from 'data/workspaces'
import { HOME, SEARCH, USER, WORKSPACES_LIST, WORKSPACE_SEARCH } from 'routes/routes'
import {
  selectIsWorkspaceLocation,
  selectLocationCategory,
  selectLocationType,
} from 'routes/routes.selectors'
import { selectUserData } from 'features/user/selectors/user.selectors'
import { useClickedEventConnect } from 'features/map/map-interactions.hooks'
import { selectAvailableWorkspacesCategories } from 'features/workspaces-list/workspaces-list.selectors'
import { useSetViewState } from 'features/map/map-viewport.hooks'
// import HelpModal from 'features/help/HelpModal'
import LanguageToggle from 'features/i18n/LanguageToggle'
import WhatsNew from 'features/sidebar/WhatsNew'
import HelpHub from 'features/help/HelpHub'
import { selectFeedbackModalOpen, setModalOpen } from 'features/modals/modals.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectWorkspace } from 'features/workspace/workspace.selectors'
import UserButton from 'features/user/UserButton'
import { DEFAULT_WORKSPACE_LIST_VIEWPORT } from 'data/config'
import styles from './CategoryTabs.module.css'

const FeedbackModal = dynamic(
  () => import(/* webpackChunkName: "FeedbackModal" */ 'features/feedback/FeedbackModal')
)

type CategoryTabsProps = {
  onMenuClick: () => void
}

function getLinkToCategory(category: WorkspaceCategory) {
  return {
    type: WORKSPACES_LIST,
    payload: { workspaceId: undefined, category: category || DEFAULT_WORKSPACE_CATEGORY },
    replaceQuery: true,
  }
}

function CategoryTabs({ onMenuClick }: CategoryTabsProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { dispatchClickedEvent } = useClickedEventConnect()
  const locationType = useSelector(selectLocationType)
  const setViewState = useSetViewState()
  const workspace = useSelector(selectWorkspace)
  const isWorkspaceLocation = useSelector(selectIsWorkspaceLocation)
  const locationCategory = useSelector(selectLocationCategory)
  const availableCategories = useSelector(selectAvailableWorkspacesCategories)
  const userData = useSelector(selectUserData)

  const modalFeedbackOpen = useSelector(selectFeedbackModalOpen)

  const onFeedbackClick = useCallback(() => {
    if (userData) {
      dispatch(setModalOpen({ id: 'feedback', open: true }))
    }
  }, [dispatch, userData])

  const onCategoryClick = useCallback(() => {
    setViewState(DEFAULT_WORKSPACE_LIST_VIEWPORT)
    dispatchClickedEvent(null)
  }, [setViewState, dispatchClickedEvent])

  const onSearchClick = useCallback(() => {
    trackEvent({
      category: TrackCategory.SearchVessel,
      action: 'Click search icon to open search panel',
    })
  }, [])

  return (
    <Fragment>
      <ul className={cx('print-hidden', styles.CategoryTabs)}>
        <li className={styles.tab} onClick={onMenuClick}>
          <span className={styles.tabContent}>
            <Icon icon="menu" />
          </span>
        </li>
        <li
          className={cx(styles.tab, {
            [styles.current]: locationType === SEARCH || locationType === WORKSPACE_SEARCH,
          })}
        >
          <Link
            className={styles.tabContent}
            to={{
              type: isWorkspaceLocation ? WORKSPACE_SEARCH : SEARCH,
              payload: {
                category: workspace?.category || DEFAULT_WORKSPACE_CATEGORY,
                workspaceId: workspace?.id || DEFAULT_WORKSPACE_ID,
              },
            }}
            onClick={onSearchClick}
          >
            <Tooltip content={t('search.vessels', 'Search vessels')} placement="right">
              <span className={styles.tabContent}>
                <Icon icon="category-search" className={styles.searchIcon} />
              </span>
            </Tooltip>
          </Link>
        </li>
        {availableCategories?.map((category, index) => (
          <li
            key={category.title}
            className={cx(styles.tab, {
              [styles.current]:
                (locationType !== SEARCH &&
                  locationType !== WORKSPACE_SEARCH &&
                  locationCategory === (category.title as WorkspaceCategory)) ||
                (index === 0 && locationType === HOME),
            })}
          >
            <Link
              className={styles.tabContent}
              to={getLinkToCategory(category.title as WorkspaceCategory)}
              onClick={onCategoryClick}
              title={category.title}
            >
              <Icon icon={`category-${category.title}` as IconType} />
            </Link>
          </li>
        ))}
        <li className={styles.separator} aria-hidden></li>
        <li className={cx(styles.tab, styles.secondary)}>
          <WhatsNew />
        </li>
        <li className={cx(styles.tab, styles.secondary)}>
          <HelpHub />
        </li>
        <li className={cx(styles.tab, styles.secondary)}>
          <div className={cx(styles.linksToggle)}>
            <div className={styles.linksBtn}>
              <IconButton icon="feedback" />
            </div>
            <ul className={styles.links}>
              <li>
                <span className={cx(styles.link)} onClick={onFeedbackClick}>
                  {t('feedback.logAnIssue', 'Log an issue')}
                </span>
              </li>
              <li>
                <a
                  href={'https://feedback.globalfishingwatch.org/'}
                  target="_blank"
                  rel="noreferrer"
                  className={cx(styles.link)}
                >
                  {t('feedback.requestAnImprovement', 'Request an improvement')}
                </a>
              </li>
            </ul>
          </div>
        </li>
        <li className={styles.tab}>
          <LanguageToggle />
        </li>
        <li
          className={cx(styles.tab, {
            [styles.current]: locationType === USER,
          })}
        >
          <UserButton className={styles.userButton} testId="sidebar-login-icon" />
        </li>
      </ul>
      {modalFeedbackOpen && (
        <FeedbackModal
          isOpen={modalFeedbackOpen}
          onClose={() => dispatch(setModalOpen({ id: 'feedback', open: false }))}
        />
      )}
    </Fragment>
  )
}

export default CategoryTabs
