import { Fragment, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Link from 'redux-first-router-link'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { Icon, IconButton, IconType, Tooltip } from '@globalfishingwatch/ui-components'
import { useFeatureState } from '@globalfishingwatch/react-hooks'
import { WorkspaceCategory } from 'data/workspaces'
import { HOME, USER, WORKSPACES_LIST } from 'routes/routes'
import { selectLocationCategory, selectLocationType } from 'routes/routes.selectors'
import { selectUserData, isGuestUser } from 'features/user/user.slice'
import { useClickedEventConnect } from 'features/map/map.hooks'
import useMapInstance from 'features/map/map-context.hooks'
import { selectAvailableWorkspacesCategories } from 'features/workspaces-list/workspaces-list.selectors'
import { useViewStateAtom } from 'features/map/map-viewport.hooks'
// import HelpModal from 'features/help/HelpModal'
import LanguageToggle from 'features/i18n/LanguageToggle'
import WhatsNew from 'features/sidebar/WhatsNew'
import LocalStorageLoginLink from 'routes/LoginLink'
import HelpHub from 'features/help/HelpHub'
import { selectFeedbackModalOpen, setModalOpen } from 'features/modals/modals.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import styles from './CategoryTabs.module.css'

const FeedbackModal = dynamic(
  () => import(/* webpackChunkName: "FeedbackModal" */ 'features/feedback/FeedbackModal')
)

const DEFAULT_WORKSPACE_LIST_VIEWPORT = {
  latitude: 10,
  longitude: -90,
  zoom: 1,
}

type CategoryTabsProps = {
  onMenuClick: () => void
}

function getLinkToCategory(category: WorkspaceCategory) {
  return {
    type: WORKSPACES_LIST,
    payload: { workspaceId: undefined, category },
    replaceQuery: true,
  }
}

function CategoryTabs({ onMenuClick }: CategoryTabsProps) {
  const { t } = useTranslation()
  const guestUser = useSelector(isGuestUser)
  const dispatch = useAppDispatch()
  const { cleanFeatureState } = useFeatureState(useMapInstance())
  const { dispatchClickedEvent } = useClickedEventConnect()
  const locationType = useSelector(selectLocationType)
  const { setViewState } = useViewStateAtom()
  const locationCategory = useSelector(selectLocationCategory)
  const availableCategories = useSelector(selectAvailableWorkspacesCategories)
  const userData = useSelector(selectUserData)
  const initials = userData
    ? `${userData?.firstName?.slice(0, 1)}${userData?.lastName?.slice(0, 1)}`
    : ''

  const modalFeedbackOpen = useSelector(selectFeedbackModalOpen)

  const onFeedbackClick = useCallback(() => {
    if (userData) {
      dispatch(setModalOpen({ id: 'feedback', open: true }))
    }
  }, [dispatch, userData])

  const onCategoryClick = useCallback(() => {
    setViewState(DEFAULT_WORKSPACE_LIST_VIEWPORT)
    dispatchClickedEvent(null)
    cleanFeatureState('highlight')
  }, [setViewState, cleanFeatureState, dispatchClickedEvent])

  return (
    <Fragment>
      <ul className={cx('print-hidden', styles.CategoryTabs)}>
        <li className={styles.tab} onClick={onMenuClick}>
          <span className={styles.tabContent}>
            <Icon icon="menu" />
          </span>
        </li>
        {availableCategories?.map((category, index) => (
          <li
            key={category.title}
            className={cx(styles.tab, {
              [styles.current]:
                locationCategory === (category.title as WorkspaceCategory) ||
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
          {guestUser ? (
            <Tooltip content={t('common.login', 'Log in')}>
              <LocalStorageLoginLink className={styles.loginLink}>
                <Icon icon="user" />
              </LocalStorageLoginLink>
            </Tooltip>
          ) : (
            <Link
              to={{
                type: USER,
                payload: {},
                query: { ...DEFAULT_WORKSPACE_LIST_VIEWPORT },
                replaceQuery: true,
              }}
            >
              {userData ? initials : <Icon icon="user" className="print-hidden" />}
            </Link>
          )}
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
