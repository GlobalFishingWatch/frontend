import React, { useState, useCallback } from 'react'
import cx from 'classnames'
import { event as uaEvent } from 'react-ga'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Icon } from '@globalfishingwatch/ui-components'
import { selectReadOnly } from 'features/app/app.selectors'
import TooltipContainer from '../../workspace/shared/TooltipContainer'
import hintsConfig, { HintId } from './hints.content'
import styles from './Hint.module.css'
import { selectHintsDismissed, setHintDismissed } from './hints.slice'

type HintProps = {
  id: HintId
  className?: string
}

export const DISMISSED = 'dismissed'

function Hint({ id, className }: HintProps) {
  const { t } = useTranslation(['translations', 'helpHints'])
  const { placement, imageUrl, pulse, openedByDefault } = hintsConfig[id]
  const isReadOnly = useSelector(selectReadOnly)
  const dispatch = useDispatch()
  const [visible, setVisible] = useState(openedByDefault || false)
  const hintsDismissed = useSelector(selectHintsDismissed)

  const onDismiss = useCallback(() => {
    setVisible(false)
    dispatch(setHintDismissed(id))
    uaEvent({
      category: 'Help hints',
      action: `Dismiss one specific help hint`,
      label: id,
    })
  }, [dispatch, id])

  const onDismissAll = useCallback(() => {
    setVisible(false)
    Object.keys(hintsConfig).forEach((id) => {
      dispatch(setHintDismissed(id as HintId))
    })
    uaEvent({
      category: 'Help hints',
      action: `Dismiss all help hints before viewing all`,
      label: id,
    })
  }, [dispatch, id])

  const showHint = useCallback(() => {
    setVisible(true)
    uaEvent({
      category: 'Help hints',
      action: `Click on a help hint to view supporting information`,
      label: id,
    })
  }, [id])
  const hideHint = useCallback(() => {
    setVisible(false)
  }, [])

  if (hintsDismissed?.[id] === true || isReadOnly) return null

  return (
    <TooltipContainer
      visible={visible}
      className={styles.HintPanel}
      arrowClass={styles.arrow}
      placement={placement}
      key={`${id}-tooltip`}
      onClickOutside={hideHint}
      component={
        <div className={styles.container}>
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className={styles.img}
              src={imageUrl}
              role="presentation"
              alt=""
              width="240px"
              height="160px"
            />
          )}
          <div className={styles.content}>
            <p className={styles.text}>{t(`helpHints:${id}`)}</p>
          </div>
          <div className={styles.footer}>
            <Button type="secondary" onClick={onDismissAll} className={styles.footerBtn}>
              {t('translations:common.hideAllHelpHints', 'Dismiss all')}
            </Button>
            <Button type="secondary" onClick={onDismiss} className={styles.footerBtn}>
              {t('translations:common.hideHelpHint', 'Dismiss')}
            </Button>
          </div>
        </div>
      }
    >
      <div
        className={cx(styles.hintTarget, className)}
        onClick={visible ? onDismiss : showHint}
        key={`${id}-bubble`}
      >
        <div className={cx(styles.hintBubble, styles[pulse])}>
          <Icon icon="help" className={styles.icon} />
        </div>
      </div>
    </TooltipContainer>
  )
}

export default Hint
