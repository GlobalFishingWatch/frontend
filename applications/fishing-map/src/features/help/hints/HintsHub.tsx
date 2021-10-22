import React, { useEffect, useRef } from 'react'
import cx from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'
import hintsConfig from './hints.content'
import { resetHints, selectHintsDismissed, setHints } from './hints.slice'
import styles from './Hint.module.css'

function HintsHub() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const hintsConfigArray = Object.keys(hintsConfig || {})
  const hintsDismissed = useSelector(selectHintsDismissed)
  const hintsDismissedArray = Object.keys(hintsDismissed || {})
  const percentageOfHintsSeen = (hintsDismissedArray.length / hintsConfigArray.length) * 100

  const onHelpClick = () => {
    dispatch(resetHints())
  }

  useEffect(() => {
    dispatch(setHints())
  }, [dispatch])

  const disabled = percentageOfHintsSeen === 0
  return (
    <IconButton
      tooltip={!disabled ? t('common.resetHelpHints', 'Show again all help hints') : ''}
      icon="help"
      disabled={disabled}
      onClick={onHelpClick}
      type="border"
      className={cx(styles.hintsHub, { [styles.pulseDarkOnce]: hintsDismissedArray.length === 1 })}
      style={{
        background: `linear-gradient(to top, #fff8cd 0%, #fff8cd ${percentageOfHintsSeen}%, rgba(0,0,0,0) ${percentageOfHintsSeen}%, rgba(0,0,0,0) 100%) no-repeat`,
      }}
    />
  )
}

export default HintsHub
