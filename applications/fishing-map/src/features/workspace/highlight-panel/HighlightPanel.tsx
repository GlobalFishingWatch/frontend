import React, { useState, useLayoutEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@globalfishingwatch/ui-components/dist/button'
import useLocalStorage from 'hooks/use-local-storage'
import { Locale } from 'types'
import TooltipContainer from '../shared/TooltipContainer'
import HighlightConfig from './highlight-panel.content'
import styles from './HighlightPanel.module.css'

type HighlightPanelProps = {
  dataviewInstanceId: string
}

export const HIGHLIGHT_POPUP_KEY = 'HighlightPopup'

const HighlightPanel = ({ dataviewInstanceId }: HighlightPanelProps) => {
  const { t, i18n } = useTranslation()
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)
  const [dataviewIdDismissed, setDataviewIdDismissed] = useLocalStorage(HIGHLIGHT_POPUP_KEY, '')
  const matchDataviewInstance = HighlightConfig.dataviewInstanceId === dataviewInstanceId

  useLayoutEffect(() => {
    if (matchDataviewInstance && dataviewIdDismissed !== HighlightConfig.dataviewInstanceId) {
      setTimeout(() => {
        if (ref.current?.scrollIntoView) {
          ref.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
        }
        setVisible(true)
      }, 2000)
    }
  }, [matchDataviewInstance, dataviewIdDismissed])

  const onDismiss = () => {
    setVisible(false)
    setDataviewIdDismissed(HighlightConfig.dataviewInstanceId)
  }

  if (!matchDataviewInstance) {
    return null
  }

  const highlightContent = HighlightConfig[(i18n.language as Locale) || Locale.en]
  if (!highlightContent) {
    console.warn('Missing every welcome modal content by languages')
    return null
  }

  return (
    <TooltipContainer
      visible={visible}
      className={styles.noBorder}
      component={
        <div className={styles.container}>
          <img className={styles.img} src={HighlightConfig.imageUrl} alt="highlight dataview" />
          <div className={styles.content}>
            <h3 className={styles.title}>{highlightContent.title}</h3>
            <p className={styles.text}>{highlightContent.description}</p>
          </div>
          <div className={styles.footer}>
            <Button type="secondary" onClick={onDismiss}>
              {t('common.dismiss', 'Dismiss')}
            </Button>
            <Button href={HighlightConfig.learnMoreUrl} target="_blank" onClick={onDismiss}>
              {t('common.learnMore', 'Learn more')}
            </Button>
          </div>
        </div>
      }
    >
      <div className={styles.highlightRef} ref={ref}></div>
    </TooltipContainer>
  )
}

export default HighlightPanel
