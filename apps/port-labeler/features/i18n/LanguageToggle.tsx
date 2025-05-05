import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { Icon } from '@globalfishingwatch/ui-components'

import { LocaleLabels } from 'features/i18n/i18n'
import type { Locale } from 'types'

import styles from './LanguageToggle.module.css'

type LanguageToggleProps = {
  className?: string
  position?: 'bottomRight' | 'rightDown'
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({
  position = 'bottomRight',
  className = '',
}: LanguageToggleProps) => {
  const { i18n } = useTranslation()
  const toggleLanguage = (lang: Locale) => {
    i18n.changeLanguage(lang)
  }
  return (
    <div className={cx(styles.languageToggle, className)}>
      <div className={styles.languageBtn}>
        <Icon icon="language" />
      </div>
      <ul className={cx(styles.languages, styles[position])}>
        {LocaleLabels.map(({ id, label }) => (
          <li key={id}>
            <button
              onClick={() => toggleLanguage(id)}
              className={cx(styles.language, {
                [styles.currentLanguage]: i18n.language === id,
              })}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default LanguageToggle
