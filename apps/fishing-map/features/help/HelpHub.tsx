import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { IconButton } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { useUserGuidePanel } from 'features/content/content.hooks'

import hintsConfig from './hints.content'
import { resetHints, selectHintsDismissed } from './hints.slice'

import styles from './Hint.module.css'

const HELP_COLOR =
  (typeof window !== 'undefined' &&
    getComputedStyle(document.documentElement).getPropertyValue('--color-help-yellow')) ||
  '#fff8cd'

function HelpHub() {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const { open: openUserGuide } = useUserGuidePanel()
  const hintsConfigArray = Object.keys(hintsConfig || {})
  const hintsDismissed = useSelector(selectHintsDismissed)
  const hintsDismissedArray = Object.keys(hintsDismissed || {})
  const percentageOfHintsSeen = (hintsDismissedArray.length / hintsConfigArray.length) * 100
  const noHelpHintsSeen = percentageOfHintsSeen === 0

  const onHelpClick = () => {
    trackEvent({
      category: TrackCategory.HelpHints,
      action: `Pressing the '?' on the left of the screen to restore help hints after they've been dismissed`,
      label: percentageOfHintsSeen.toString(),
    })
    dispatch(resetHints())
  }

  const getFAQsLink = () => {
    if (i18n.language === 'es') return 'https://globalfishingwatch.org/es/ayuda-faqs/'
    return 'https://globalfishingwatch.org/help-faqs/'
  }

  const getVideoTutorialsLink = () => {
    if (i18n.language === 'es') return 'https://globalfishingwatch.org/tutoriales'
    return 'https://globalfishingwatch.org/tutorials'
  }

  return (
    <div className={cx(styles.linksToggle)}>
      <div className={styles.linksBtn}>
        <IconButton
          icon="help"
          testId="help-hub-button"
          type="border"
          className={cx({
            [styles.pulseDarkOnce]: hintsDismissedArray.length === 1,
          })}
          style={{
            background: `linear-gradient(to top, ${HELP_COLOR} 0%, ${HELP_COLOR} ${percentageOfHintsSeen}%, rgba(0,0,0,0) ${percentageOfHintsSeen}%, rgba(0,0,0,0) 100%) no-repeat`,
          }}
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
            onClick={() => {
              trackEvent({
                category: TrackCategory.HelpHints,
                action: 'Open user guide modal',
              })
              openUserGuide()
            }}
          >
            {t((t) => t.common.userGuide)}
          </button>
        </li>
        <li>
          <a
            href={getVideoTutorialsLink()}
            target="_blank"
            rel="noreferrer"
            className={cx(styles.link)}
          >
            {t((t) => t.common.tutorials)}
          </a>
        </li>
        <li>
          <a href={getFAQsLink()} target="_blank" rel="noreferrer" className={cx(styles.link)}>
            {t((t) => t.common.faq)}
          </a>
        </li>
      </ul>
    </div>
  )
}

export default HelpHub
