import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { IconButton } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { useIsClientHydrated } from 'hooks/ssr.hooks'

import hintsConfig from './hints.content'
import { resetHints, selectHintsDismissed } from './hints.slice'

import styles from './Hint.module.css'

function HelpHub() {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const isClientHydrated = useIsClientHydrated()
  const hintsConfigArray = Object.keys(hintsConfig || {})
  const hintsDismissed = useSelector(selectHintsDismissed)
  const hintsDismissedArray = isClientHydrated ? Object.keys(hintsDismissed || {}) : []
  const percentageOfHintsSeen = (hintsDismissedArray.length / hintsConfigArray.length) * 100
  const noHelpHintsSeen = percentageOfHintsSeen === 0

  const onHelpClick = () => {
    trackEvent({
      category: TrackCategory.HelpHints,
      action: `restore help hints after they've been dismissed`,
      label: `percentage of hints seen: ${percentageOfHintsSeen.toString()}%`,
    })
    dispatch(resetHints())
  }

  const getUserGuideLink = () => {
    if (i18n.language === 'es') return 'https://globalfishingwatch.org/es/guia-de-usuario/'
    if (i18n.language === 'fr') return 'https://globalfishingwatch.org/user-guide-french/'
    if (i18n.language === 'pt') return 'https://globalfishingwatch.org/user-guide-portuguese/'
    return 'https://globalfishingwatch.org/user-guide/'
  }

  const getFAQsLink = () => {
    if (i18n.language === 'es') return 'https://globalfishingwatch.org/es/ayuda-faqs/'
    return 'https://globalfishingwatch.org/help-faqs/'
  }

  const getVideoTutorialsLink = () => {
    if (i18n.language === 'es') return 'https://globalfishingwatch.org/tutoriales'
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
          <a
            href={getUserGuideLink()}
            target="_blank"
            rel="noreferrer"
            className={cx(styles.link)}
            onClick={() => redirectEvent('user guide')}
          >
            {t((t) => t.common.userGuide)}
          </a>
        </li>
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
