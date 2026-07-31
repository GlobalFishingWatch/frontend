import type { ReactNode } from 'react'
import { Fragment, lazy, Suspense, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { IconButton } from '@globalfishingwatch/ui-components/icon-button'

import { IS_CHATBOT_ENABLED } from 'data/map/config'
import { useSidePanel } from 'features/_map/content-panel/contentPanel.hooks'
import { selectIsGFWUser, selectUserData } from 'features/_user/selectors/user.selectors'
import UserButton from 'features/_user/UserButton'
import { useAppDispatch } from 'features/app/app.hooks'
import HelpHub from 'features/hints/HelpHub'
import { CROWDIN_IN_CONTEXT_LANG } from 'features/i18n/i18n.config'
import { useLanguageOptions } from 'features/i18n/language.hooks'
import LanguageToggle, { CrowdinScripts } from 'features/i18n/LanguageToggle'
import { selectFeedbackModalOpen, setModalOpen } from 'features/modals/modals.slice'
import type { NavItem } from 'features/nav/nav.config'
import { getPlatformBottomSections, PLATFORM_MODE } from 'features/nav/nav.config'
import WhatsNew from 'features/nav/WhatsNew'
import { selectIsUserLocation } from 'router/routes.selectors'

import styles from './MainNav.module.css'

const FeedbackModal = lazy(() => import('features/feedback/FeedbackModal'))

type NavBottomProps = {
  renderSection: (section: NavItem) => ReactNode
}

function NavBottom({ renderSection }: NavBottomProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const userData = useSelector(selectUserData)
  const isGFWUser = useSelector(selectIsGFWUser)
  const isUserLocation = useSelector(selectIsUserLocation)
  const modalFeedbackOpen = useSelector(selectFeedbackModalOpen)
  const { openSidePanel } = useSidePanel()
  const {
    options: languageOptions,
    toggleLanguage,
    currentLanguage,
    isLoading: isLanguageLoading,
  } = useLanguageOptions()

  const onFeedbackClick = useCallback(() => {
    if (userData) {
      dispatch(setModalOpen({ id: 'feedback', open: true }))
    }
  }, [dispatch, userData])

  const sections = getPlatformBottomSections(t, {
    onAssistantClick: () => openSidePanel({ type: 'chat' }),
    onLogIssueClick: onFeedbackClick,
  })

  const languageSection: NavItem = {
    id: 'language',
    icon: 'language',
    label:
      languageOptions.find(({ id }) => id === currentLanguage)?.label ?? t((t) => t.nav.language),
    loading: isLanguageLoading,
    subsections: languageOptions
      .filter(({ id }) => id !== currentLanguage)
      .map(({ id, label, testId }) => ({
        id: `language-${id}`,
        label,
        testId,
        onClick: () => !isLanguageLoading && toggleLanguage(id),
      })),
  }

  return (
    <Fragment>
      <ul className={styles.bottom}>
        {PLATFORM_MODE ? (
          <Fragment>
            {IS_CHATBOT_ENABLED && isGFWUser && renderSection(sections.assistant)}
            {renderSection(sections.feedback)}
            {renderSection(languageSection)}
            <CrowdinScripts enabled={currentLanguage === CROWDIN_IN_CONTEXT_LANG} />
            {renderSection(sections.settings)}
          </Fragment>
        ) : (
          <Fragment>
            <li className={cx(styles.tab, styles.secondary)}>
              <WhatsNew />
            </li>
            <li className={cx(styles.tab, styles.secondary)}>
              <HelpHub />
            </li>
            <li className={cx(styles.tab, styles.secondary)}>
              <div className={cx(styles.linksToggle)}>
                <div className={styles.linksBtn}>
                  <IconButton icon="feedback" testId="feedback-button" />
                </div>
                <ul className={styles.links} data-testid="feedback-menu">
                  <li>
                    <span
                      role="button"
                      tabIndex={0}
                      className={cx(styles.link)}
                      onClick={onFeedbackClick}
                      data-testid="open-feedback-modal"
                    >
                      {t((t) => t.feedback.logAnIssue)}
                    </span>
                  </li>
                  <li>
                    <a
                      href={'https://feedback.globalfishingwatch.org/'}
                      target="_blank"
                      rel="noreferrer"
                      className={cx(styles.link)}
                    >
                      {t((t) => t.feedback.requestAnImprovement)}
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            <li className={cx(styles.tab, styles.secondary)}>
              <LanguageToggle />
            </li>
          </Fragment>
        )}
        <li className={cx(styles.tab, styles.user, { [styles.current]: isUserLocation })}>
          <UserButton className={styles.tabContent} withLabel={PLATFORM_MODE} />
        </li>
      </ul>
      {modalFeedbackOpen && (
        <Suspense fallback={null}>
          <FeedbackModal
            isOpen={modalFeedbackOpen}
            onClose={() => dispatch(setModalOpen({ id: 'feedback', open: false }))}
          />
        </Suspense>
      )}
    </Fragment>
  )
}

export default NavBottom
