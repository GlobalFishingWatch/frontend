import { Fragment, useCallback,useState } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import type { Locale } from 'types'

import { IconButton } from '@globalfishingwatch/ui-components'

import { TrackCategory,trackEvent } from 'features/app/analytics.hooks'
import { LocaleLabels } from 'features/i18n/i18n'

import styles from './LanguageToggle.module.css'

const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const toggleLanguage = useCallback(
    (lang: Locale) => {
      trackEvent({
        category: TrackCategory.GeneralVVFeatures,
        action: 'Change language',
        label: lang,
      })
      i18n.changeLanguage(lang)
      setOpen(false)
    },
    [setOpen, i18n]
  )
  const onOpen = useCallback(() => {
    setOpen(!open)
  }, [open, setOpen])
  return (
    <Fragment>
      <IconButton type="default" size="default" className={styles.button} onClick={onOpen}>
        {i18n.language}
        {open && (
          <ul className={styles.list}>
            {LocaleLabels.map(({ id, label }) => (
              <li
                key={id}
                className={cx(styles.language, {
                  [styles.currentLanguage]: i18n.language === id,
                })}
                onClick={() => toggleLanguage(id)}
              >
                {label}
              </li>
            ))}
          </ul>
        )}
      </IconButton>
    </Fragment>
  )
}

export default LanguageToggle
