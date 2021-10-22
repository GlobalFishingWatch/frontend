import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'
import hintsConfig from './hints.content'
import styles from './Hint.module.css'
import { resetHints, selectHintsDismissed, setHints } from './hints.slice'

function HintsHub() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const hintsConfigArray = Object.keys(hintsConfig || {})
  const hintsDismissed = useSelector(selectHintsDismissed)
  const hintsSeen = Object.keys(hintsDismissed || {}).length
  const percentageOfHintsSeen = (hintsSeen / hintsConfigArray.length) * 100

  const onHelpClick = () => {
    dispatch(resetHints())
  }

  useEffect(() => {
    dispatch(setHints())
  }, [dispatch])

  if (percentageOfHintsSeen === 0) return null
  return (
    <IconButton
      tooltip={t('common.resetHelpHints', 'Show again all help hints')}
      icon="help"
      onClick={onHelpClick}
      type="border"
      className={styles.hintsHub}
      style={{
        background: `linear-gradient(to top, #fff8cd 0%, #fff8cd ${percentageOfHintsSeen}%, rgba(0,0,0,0) ${percentageOfHintsSeen}%, rgba(0,0,0,0) 100%) no-repeat`,
      }}
    />
  )
}

export default HintsHub
