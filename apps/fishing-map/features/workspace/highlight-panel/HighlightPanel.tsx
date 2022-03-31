import React, { useState, useRef, useEffect } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { Button } from '@globalfishingwatch/ui-components'
import { useLocalStorage } from '@globalfishingwatch/react-hooks'
import { Locale } from 'types'
import { useMapReady } from 'features/map/map-state.hooks'
import TooltipContainer from '../shared/TooltipContainer'
import HighlightConfig from './highlight-panel.content'
import styles from './HighlightPanel.module.css'

type HighlightPanelProps = {
  dataviewInstanceId: string
}

export const HIGHLIGHT_POPUP_KEY = 'HighlightPopup'

const HighlightPanel = ({ dataviewInstanceId }: HighlightPanelProps) => {
  const { t, i18n } = useTranslation()
  const mapReady = useMapReady()
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)
  const [dataviewIdDismissed, setDataviewIdDismissed] = useLocalStorage(HIGHLIGHT_POPUP_KEY, '')
  const matchDataviewInstance = HighlightConfig.dataviewInstanceId === dataviewInstanceId

  const setHighlightPanel = () => {
    if (ref.current?.scrollIntoView) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
    }
    if (!HighlightConfig.delayed) setVisible(true)
  }

  const showHighlightPanel =
    mapReady && matchDataviewInstance && dataviewIdDismissed !== HighlightConfig.dataviewInstanceId

  useEffect(() => {
    if (showHighlightPanel) {
      setHighlightPanel()
    }
  }, [showHighlightPanel])

  useEffect(() => {
    if (!showHighlightPanel || !HighlightConfig.delayed) return
    setTimeout(() => {
      const container = document.querySelector('.scrollContainer')
      container.scrollTop = 1
      setVisible(true)
    }, 5000)
  }, [showHighlightPanel])

  const onDismiss = () => {
    setVisible(false)
    setDataviewIdDismissed(HighlightConfig.dataviewInstanceId)
  }

  if (!matchDataviewInstance) {
    return null
  }

  const highlightContent = HighlightConfig[i18n.language as Locale] || HighlightConfig[Locale.en]
  if (!highlightContent) {
    console.warn('Missing every welcome modal content by languages')
    return null
  }

  const learnMoreUrl = highlightContent.learnMoreUrl || HighlightConfig.learnMoreUrl

  return (
    <TooltipContainer
      visible={visible}
      className={styles.highlightPanel}
      component={
        <div className={styles.container}>
          <img className={styles.img} src={HighlightConfig.imageUrl} alt="highlight dataview" />
          <div className={styles.content}>
            <h3 className={styles.title}>{highlightContent.title}</h3>
            <p className={styles.text}>{highlightContent.description}</p>
          </div>
          <div className={styles.footer}>
            <Button type="secondary" onClick={onDismiss} className={styles.footerBtn}>
              {t('common.dismiss', 'Dismiss')}
            </Button>
            {learnMoreUrl && (
              <Button
                href={learnMoreUrl}
                target="_blank"
                onClick={onDismiss}
                className={cx(styles.footerBtn, styles.cta)}
              >
                {t('common.learnMore', 'Learn more')}
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className={styles.highlightRef} ref={ref}></div>
    </TooltipContainer>
  )
}

export default HighlightPanel
