import React, { useState } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import Button from '@globalfishingwatch/ui-components/dist/button'
import Icon from '@globalfishingwatch/ui-components/dist/icon'
import { isGFWUser } from 'features/user/user.slice'
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
  const gfwUser = useSelector(isGFWUser)
  const dispatch = useDispatch()
  const [visible, setVisible] = useState(false)
  const hintsDismissed = useSelector(selectHintsDismissed)
  const { placement, imageUrl, pulse } = hintsConfig[id]

  const onDismiss = () => {
    setVisible(false)
    dispatch(setHintDismissed(id))
  }

  const onDismissAll = () => {
    setVisible(false)
    Object.keys(hintsConfig).forEach((id) => {
      dispatch(setHintDismissed(id as HintId))
    })
  }

  const showHint = () => {
    setVisible(true)
  }

  if (hintsDismissed?.[id] === true || !gfwUser) return null

  return (
    <TooltipContainer
      visible={visible}
      className={styles.HintPanel}
      arrowClass={styles.arrow}
      placement={placement}
      onClickOutside={onDismiss}
      component={
        <div className={styles.container}>
          <img className={styles.img} src={imageUrl} role="presentation" alt="" />
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
      <div className={cx(styles.hintTarget, className)} onClick={visible ? onDismiss : showHint}>
        <div className={cx(styles.hintBubble, styles[pulse])}>
          <Icon icon="help" className={styles.icon} />
        </div>
      </div>
    </TooltipContainer>
  )
}

export default Hint
