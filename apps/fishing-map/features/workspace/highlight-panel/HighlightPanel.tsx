import { useState, useRef, useEffect } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import type { Placement } from 'tippy.js'
import { useSelector } from 'react-redux'
import { Button } from '@globalfishingwatch/ui-components'
import { useLocalStorage } from '@globalfishingwatch/react-hooks'
import { Locale } from 'types'
import { selectIsMapLoaded } from 'features/map/map.slice'
import TooltipContainer from '../shared/TooltipContainer'
import HIGHLIGHT_CONFIG, { HighlightPanelConfig } from './highlight-panel.content'
import styles from './HighlightPanel.module.css'

type HighlightPanelProps = {
  dataviewInstanceId: string
  placement?: Placement
  config?: HighlightPanelConfig
}

const HighlightPanel = ({
  dataviewInstanceId,
  placement,
  config = HIGHLIGHT_CONFIG,
}: HighlightPanelProps) => {
  const { t, i18n } = useTranslation()
  const mapReady = useSelector(selectIsMapLoaded)
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)
  const [dataviewIdDismissed, setDataviewIdDismissed] = useLocalStorage(config.localStorageKey, '')
  const matchDataviewInstance = config.dataviewInstanceId === dataviewInstanceId

  const showHighlightPanel =
    mapReady && matchDataviewInstance && dataviewIdDismissed !== config.dataviewInstanceId

  useEffect(() => {
    if (showHighlightPanel) {
      if (ref.current?.scrollIntoView) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
      }
      if (config.delayed) {
        setTimeout(() => {
          const container = document.querySelector('.scrollContainer')
          if (container) {
            container.scrollTop = 1
          }
          setVisible(true)
        }, config.delayed)
      } else {
        setVisible(true)
      }
    }
  }, [showHighlightPanel, config.delayed])

  const onDismiss = () => {
    setVisible(false)
    setDataviewIdDismissed(config.dataviewInstanceId)
  }

  if (!matchDataviewInstance) {
    return null
  }

  const highlightContent = config[i18n.language as Locale] || config[Locale.en]
  if (!highlightContent) {
    console.warn('Missing every welcome modal content by languages')
    return null
  }

  const learnMoreUrl = highlightContent.learnMoreUrl || config.learnMoreUrl

  return (
    <TooltipContainer
      visible={visible}
      className={styles.highlightPanel}
      placement={placement || 'auto'}
      component={
        <div className={styles.container}>
          {config.imageUrl && (
            <img className={styles.img} src={config.imageUrl} alt="highlight dataview" />
          )}
          <div className={styles.content}>
            <h3 className={styles.title}>{highlightContent.title}</h3>
            <p className={styles.text}>
              {highlightContent.description}{' '}
              {config.workspaceUrl && (
                <a href={config.workspaceUrl}>{t('common.view_layer', 'View the layer')}</a>
              )}
            </p>
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
