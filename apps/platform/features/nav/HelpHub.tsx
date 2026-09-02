import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { IconButton } from '@globalfishingwatch/ui-components/icon-button'

import { IS_CHATBOT_ENABLED } from 'data/map/config'
import { useSidePanel } from 'features/_map/content-panel/contentPanel.hooks'
import { selectIsGFWUser } from 'features/_user/selectors/user.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { setModalOpen } from 'features/modals/modals.slice'
import { useIsClientHydrated } from 'hooks/ssr.hooks'

import hintsConfig from '../hints/hints.content'
import { resetHints, selectHintsDismissed } from '../hints/hints.slice'

import styles from '../hints/Hint.module.css'

function HelpHub() {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const isClientHydrated = useIsClientHydrated()
  const isGFWUser = useSelector(selectIsGFWUser)
  const hintsConfigArray = Object.keys(hintsConfig || {})
  const hintsDismissed = useSelector(selectHintsDismissed)
  const hintsDismissedArray = isClientHydrated ? Object.keys(hintsDismissed || {}) : []
  const percentageOfHintsSeen = (hintsDismissedArray.length / hintsConfigArray.length) * 100
  const noHelpHintsSeen = percentageOfHintsSeen === 0
  const { openSidePanel } = useSidePanel()

  const onHelpClick = () => {
    trackEvent({
      category: TrackCategory.HelpHints,
      action: `restore help hints after they've been dismissed`,
      label: `percentage of hints seen: ${percentageOfHintsSeen.toString()}%`,
    })
    dispatch(resetHints())
  }

  const getFAQsLink = () => {
    if (i18n.language === 'es') return 'https://globalfishingwatch.org/es/ayuda-faqs/'
    return 'https://globalfishingwatch.org/help-faqs/'
  }

  const getVideoTutorialsLink = () => {
    if (i18n.language === 'es') return 'https://globalfishingwatch.org/es/tutoriales/'
    return 'https://globalfishingwatch.org/tutorials'
  }

  const redirectEvent = (destination: string) => {
    trackEvent({
      category: TrackCategory.HelpHints,
      action: `redirect to ${destination}`,
      label: i18n.language,
    })
  }

  return (
    <div className={cx(styles.linksToggle)}>
      <div className={styles.linksBtn}>
        <IconButton
          icon="help"
          testId="help-hub-button"
          type="border"
          className={cx(styles.helpHubButton, {
            [styles.pulseDarkOnce]: hintsDismissedArray.length === 1,
          })}
          style={
            {
              '--hints-seen': `${percentageOfHintsSeen}%`,
            } as CSSProperties
          }
        />
      </div>
      <ul className={styles.links}>
        <li>
          {noHelpHintsSeen ? (
            <span className={cx(styles.link, styles.hintsTooltip)} data-testid="help-hints-label">
              {t((t) => t.common.hints)}
            </span>
          ) : (
            <button
              type="button"
              className={cx(styles.link)}
              onClick={onHelpClick}
              data-testid="reset-help-hints"
            >
              {t((t) => t.common.resetHelpHints)}
            </button>
          )}
        </li>
        <li>
          <button
            type="button"
            className={cx(styles.link)}
            onClick={() => dispatch(setModalOpen({ id: 'onboarding', open: true }))}
          >
            {t((t) => t.onboarding.getStarted)}
          </button>
        </li>
        <li>
          <button
            type="button"
            className={cx(styles.link)}
            onClick={() => {
              trackEvent({
                category: TrackCategory.HelpHints,
                action: 'Open user guide modal',
              })
              openSidePanel({ type: 'userGuide' })
            }}
          >
            {t((t) => t.common.userGuide)}
          </button>
        </li>
        {IS_CHATBOT_ENABLED && isGFWUser && (
          <li>
            <button
              type="button"
              className={cx(styles.link)}
              onClick={() => openSidePanel({ type: 'chat' })}
            >
              {t((t) => t.common.assistant)}
            </button>
          </li>
        )}
        <li>
          <a
            href={getVideoTutorialsLink()}
            target="_blank"
            rel="noreferrer"
            className={cx(styles.link)}
            onClick={() => redirectEvent('video tutorials')}
          >
            {t((t) => t.common.tutorials)}
          </a>
        </li>
        <li>
          <a
            href={getFAQsLink()}
            target="_blank"
            rel="noreferrer"
            className={cx(styles.link)}
            onClick={() => redirectEvent('faqs')}
          >
            {t((t) => t.common.faq)}
          </a>
        </li>
      </ul>
    </div>
  )
}

export default HelpHub
