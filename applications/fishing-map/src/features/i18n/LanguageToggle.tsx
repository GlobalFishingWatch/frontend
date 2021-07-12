import { event as uaEvent } from 'react-ga'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import Icon from '@globalfishingwatch/ui-components/dist/icon'
import { Locale } from 'types'
import { LocaleLabels } from 'features/i18n/i18n'
import styles from './LanguageToggle.module.css'

type LanguageToggleProps = {
  position?: 'bottomRight' | 'rightDown'
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({
  position = 'bottomRight',
}: LanguageToggleProps) => {
  const { t, i18n } = useTranslation()
  const toggleLanguage = (lang: Locale) => {
    uaEvent({
      category: 'Internationalization',
      action: `Change language`,
      label: lang,
    })
    i18n.changeLanguage(lang)
  }
  return (
    <div className={styles.languageToggle}>
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
