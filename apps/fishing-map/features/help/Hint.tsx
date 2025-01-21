import { useCallback,useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import type { PopoverProps } from '@globalfishingwatch/ui-components'
import { Button, Icon, Popover } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectReadOnly } from 'features/app/selectors/app.selectors'

import type { HintId } from './hints.content'
import hintsConfig from './hints.content'
import { selectHintsDismissed, setHintDismissed } from './hints.slice'

import styles from './Hint.module.css'

type HintProps = {
  id: HintId
  className?: string
}

function Hint({ id, className }: HintProps) {
  const { t, ready } = useTranslation(['translations', 'help-hints'])
  const { placement, imageUrl, pulse, openedByDefault } = hintsConfig[id]
  const isReadOnly = useSelector(selectReadOnly)
  const dispatch = useAppDispatch()
  const [visible, setVisible] = useState(openedByDefault || false)
  const hintsDismissed = useSelector(selectHintsDismissed)

  const onDismiss = useCallback(() => {
    setVisible(false)
    dispatch(setHintDismissed(id))
    trackEvent({
      category: TrackCategory.HelpHints,
      action: `Dismiss one specific help hint`,
      label: id,
    })
  }, [dispatch, id])

  const onDismissAll = useCallback(() => {
    setVisible(false)
    Object.keys(hintsConfig).forEach((id) => {
      dispatch(setHintDismissed(id as HintId))
    })
    trackEvent({
      category: TrackCategory.HelpHints,
      action: `Dismiss all help hints before viewing all`,
      label: id,
    })
  }, [dispatch, id])

  const showHint = useCallback(() => {
    setVisible(true)
    trackEvent({
      category: TrackCategory.HelpHints,
      action: `Click on a help hint to view supporting information`,
      label: id,
    })
  }, [id])

  const onOpenChange: PopoverProps['onOpenChange'] = (nextOpen: boolean) => {
    setVisible(nextOpen)
  }

  if (hintsDismissed?.[id] === true || isReadOnly || !ready) return null

  return (
    <Popover
      open={visible}
      className={styles.HintPanel}
      showArrow={false}
      placement={placement}
      key={`${id}-tooltip`}
      onOpenChange={onOpenChange}
      content={
        <div className={styles.container}>
          {imageUrl && (
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
            <p className={styles.text}>{t(`help-hints:${id}`)}</p>
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
        role="button"
        tabIndex={0}
        className={cx(styles.hintTarget, className, 'print-hidden')}
        onClick={visible ? onDismiss : showHint}
        key={`${id}-bubble`}
      >
        <div className={cx(styles.hintBubble, styles[pulse])}>
          <Icon icon="help" className={styles.icon} />
        </div>
      </div>
    </Popover>
  )
}

export default Hint
