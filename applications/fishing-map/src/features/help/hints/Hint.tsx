import React, { useState } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { Icon } from '@globalfishingwatch/ui-components'
import useLocalStorage from 'hooks/use-local-storage'
import { Locale } from 'types'
import TooltipContainer from '../../workspace/shared/TooltipContainer'
import { HintConfig } from './hints.content'
import styles from './Hint.module.css'

type HintProps = {
  hint: HintConfig
}

const DISMISSED = 'dismissed'

function Hint({ hint }: HintProps) {
  const { t, i18n } = useTranslation()
  const [visible, setVisible] = useState(false)
  const [hintIdDismissed, setHintIdDismissed] = useLocalStorage(hint.hintId, '')

  if (hintIdDismissed) return null

  const onDismiss = () => {
    setVisible(false)
    setHintIdDismissed(DISMISSED)
  }
  const onToggleBubble = () => {
    setVisible(!visible)
  }

  const content = hint[i18n.language as Locale] || hint[Locale.en]
  return (
    <TooltipContainer
      visible={visible}
      className={styles.HintPanel}
      arrowClass={styles.arrow}
      placement={hint.placement}
      onClickOutside={onToggleBubble}
      component={
        <div className={styles.container}>
          <img className={styles.img} src={hint.imageUrl} role="presentation" alt="" />
          <div className={styles.content}>
            <p className={styles.text}>{content?.description}</p>
          </div>
          <div className={styles.footer}>
            <Button type="secondary" onClick={onDismiss} className={styles.footerBtn}>
              {t('common.dismiss', 'Dismiss')}
            </Button>
          </div>
        </div>
      }
    >
      <div className={styles.hintTarget} style={hint.position} onClick={onToggleBubble}>
        <div className={cx(styles.hintBubble, styles[hint.pulse])}>
          <Icon icon="help" className={styles.icon} />
        </div>
      </div>
    </TooltipContainer>
  )
}

export default Hint
