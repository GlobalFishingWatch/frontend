import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { IconButton } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'

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

  return (
    <div className={cx(styles.linksToggle)}>
      <div className={styles.linksBtn}>
        <IconButton
          icon="help"
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
            <span className={cx(styles.link, styles.hintsTooltip)}>
              {t('common.hints', 'Need help? Look for these dots')}
            </span>
          ) : (
            <span className={cx(styles.link)} onClick={onHelpClick}>
              {t('common.resetHelpHints', 'Show again all help hints')}
            </span>
          )}
        </li>
        <li>
          <a href={getUserGuideLink()} target="_blank" rel="noreferrer" className={cx(styles.link)}>
            {t('common.userGuide', 'User guide')}
          </a>
        </li>
        <li>
          <a
            href={getVideoTutorialsLink()}
            target="_blank"
            rel="noreferrer"
            className={cx(styles.link)}
          >
            {t('common.tutorials', 'Tutorials')}
          </a>
        </li>
        <li>
          <a href={getFAQsLink()} target="_blank" rel="noreferrer" className={cx(styles.link)}>
            {t('common.faq', 'FAQs')}
          </a>
        </li>
      </ul>
    </div>
  )
}

export default HelpHub
