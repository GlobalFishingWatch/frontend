import React, { useState, useRef, useEffect, useCallback } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { Button } from '@globalfishingwatch/ui-components'
import useLocalStorage from 'hooks/use-local-storage'
import { Locale } from 'types'
import useMapInstance from 'features/map/map-context.hooks'
import TooltipContainer from '../shared/TooltipContainer'
import HighlightConfig from './highlight-panel.content'
import styles from './HighlightPanel.module.css'

type HighlightPanelProps = {
  dataviewInstanceId: string
}

export const HIGHLIGHT_POPUP_KEY = 'HighlightPopup'

const HighlightPanel = ({ dataviewInstanceId }: HighlightPanelProps) => {
  const { t, i18n } = useTranslation()
  const map = useMapInstance()
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)
  const [dataviewIdDismissed, setDataviewIdDismissed] = useLocalStorage(HIGHLIGHT_POPUP_KEY, '')
  const matchDataviewInstance = HighlightConfig.dataviewInstanceId === dataviewInstanceId

  const onMapLoaded = useCallback(() => {
    if (matchDataviewInstance && dataviewIdDismissed !== HighlightConfig.dataviewInstanceId) {
      if (ref.current?.scrollIntoView) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
      }
      setVisible(true)
    }
    map?.off('idle', onMapLoaded)
  }, [map, dataviewIdDismissed, matchDataviewInstance])

  useEffect(() => {
    if (map) {
      map.on('idle', onMapLoaded)
    }
    return () => {
      if (map) {
        map.off('idle', onMapLoaded)
      }
    }
  }, [map, onMapLoaded])

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
            <Button
              href={highlightContent.learnMoreUrl || HighlightConfig.learnMoreUrl}
              target="_blank"
              onClick={onDismiss}
              className={cx(styles.footerBtn, styles.cta)}
            >
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
