import cx from 'classnames'
import { event as uaEvent } from 'react-ga'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'
import { useAppDispatch } from 'features/app/app.hooks'
import hintsConfig from './hints.content'
import { resetHints, selectHintsDismissed } from './hints.slice'
import styles from './Hint.module.css'

const HELP_COLOR =
  (typeof window !== 'undefined' &&
    getComputedStyle(document.documentElement).getPropertyValue('--color-help-yellow')) ||
  '#fff8cd'

function HintsHub() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const hintsConfigArray = Object.keys(hintsConfig || {})
  const hintsDismissed = useSelector(selectHintsDismissed)
  const hintsDismissedArray = Object.keys(hintsDismissed || {})
  const percentageOfHintsSeen = (hintsDismissedArray.length / hintsConfigArray.length) * 100

  const onHelpClick = () => {
    uaEvent({
      category: 'Help hints',
      action: `Pressing the '?' on the left of the screen to restore help hints after they've been dismissed`,
      label: percentageOfHintsSeen.toString(),
    })
    dispatch(resetHints())
  }

  const disabled = percentageOfHintsSeen === 0

  return (
    <IconButton
      tooltip={
        <span className={styles.hintsTooltip}>
          {!disabled
            ? t('common.resetHelpHints', 'Show again all help hints')
            : t('common.hints', 'Need help? Look for these dots')}
        </span>
      }
      icon="help"
      disabled={disabled}
      onClick={onHelpClick}
      type="border"
      className={cx(styles.hintsHub, { [styles.pulseDarkOnce]: hintsDismissedArray.length === 1 })}
      style={{
        background: `linear-gradient(to top, ${HELP_COLOR} 0%, ${HELP_COLOR} ${percentageOfHintsSeen}%, rgba(0,0,0,0) ${percentageOfHintsSeen}%, rgba(0,0,0,0) 100%) no-repeat`,
      }}
    />
  )
}

export default HintsHub
